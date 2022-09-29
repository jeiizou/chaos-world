import { useState } from 'react';

function genAdjust(
  elems: HTMLElement[],
  container: HTMLElement,
  config: {
    directionRight: boolean;
    offset: number;
  }
) {
  const item = elems[0];
  // total number of element
  const n_t = elems.length;
  // width of an element
  let w = parseInt(`${item.offsetWidth}`);
  // full width of element with margin
  const m = window.getComputedStyle(item);
  w = w + parseInt(m.marginLeft) + parseInt(m.marginRight);
  // width of container
  let w_c = parseInt(`${container.offsetWidth}`);
  // padding of container
  const c = window.getComputedStyle(container);
  const p_c = parseInt(c.paddingLeft) + parseInt(c.paddingRight);

  const adjust = function () {
    const tails = [];
    const heads = [];
    const orderRight = [];

    // only the width of container will change
    w_c = parseInt(`${container.offsetWidth}`);
    // Number of columns
    const nb = Math.min(parseInt(`${(w_c - p_c) / w}`), n_t);
    // Number of rows
    const nc = Math.ceil(n_t / nb);
    for (let j = 0; j < nb; j++) {
      for (let i = 0; i < nc; i++) {
        if (j + i * nb >= n_t) {
          /* we exit if we reach the number of elements*/ break;
        }
        elems[j + i * nb].style.marginLeft = `${config.offset}px`; /* we rest the margin*/
        if (i % 2 !== Number(config.directionRight)) {
          // 正向
          elems[j + i * nb].style.order = `${j + i * nb}`;

          orderRight.push(j + i * nb);
        } /* normal flow */ else {
          // 逆向
          elems[j + i * nb].style.order = `${nb - j + i * nb}`; /* opposite flow */
          /* margin fix*/
          if (i === nc - 1 && j + i * nb === n_t - 1 && j < nb - 1) {
            elems[j + i * nb].style.marginLeft = `${(nb * nc - n_t) * w + config.offset}px`;
          }
        }

        if (j === 0) {
          (elems[j + i * nb] as HTMLDivElement).setAttribute('data-site', 'head');
          heads.push(j + i * nb);
        }

        if (j >= nb - 1 || j + i * nb + 1 >= n_t) {
          (elems[j + i * nb] as HTMLDivElement).setAttribute('data-site', 'tail');
          tails.push(j + i * nb);
        }
      }
    }

    return {
      tails,
      heads,
      orderRight,
      col: nb,
      row: nc,
    };
  };

  return adjust;
}

export function useSnakeFlex({ directionRight = true }: { directionRight?: boolean } = {}) {
  const [headList, setHeadList] = useState<number[]>([]);
  const [tailList, setTailList] = useState<number[]>([]);
  const [orderRight, setOrderRight] = useState<number[]>([]);
  const [rowCol, setRoWCol] = useState<[number, number]>([0, 0]);

  const enableSnakeLayout = (items: HTMLElement[], container: HTMLElement) => {
    const adjustFn = genAdjust(items, container, {
      directionRight,
      offset: 0,
    });

    function callAdjustFn() {
      const { tails, heads, orderRight: or, row, col } = adjustFn();
      setHeadList(heads);
      setTailList(tails);
      setOrderRight(or);
      setRoWCol([row, col]);
    }

    callAdjustFn();
    window.addEventListener('resize', callAdjustFn);

    return () => {
      if (callAdjustFn) {
        window.removeEventListener('resize', callAdjustFn);
      }
    };
  };

  const isTail = (index: number): boolean => tailList.indexOf(index) !== -1;
  const isHead = (index: number): boolean => headList.indexOf(index) !== -1;
  const isOrderRight = (index: number): boolean => orderRight.indexOf(index) !== -1;

  return {
    enableSnakeLayout,
    headList,
    tailList,
    isTail,
    isHead,
    isOrderRight,
    orderRight,
    row: rowCol[0],
    col: rowCol[1],
  };
}
