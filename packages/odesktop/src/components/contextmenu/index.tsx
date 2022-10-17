import React, { useEffect, useState } from 'react';
import { DesktopModel, EVENT_TYPE } from '../../model/desktop-model';
import styles from './index.module.scss';

type ContextMenuProps = {
    // HOLD
};

export default function ContextMenu({}: ContextMenuProps): React.ReactElement {
    const { emit$ } = DesktopModel.useContext();

    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState([0, 0]);

    useEffect(() => {
        window.oncontextmenu = function (e) {
            //取消默认的浏览器自带右键
            e.preventDefault();
            setPosition([e.clientX, e.clientY]);
            setVisible(true);
        };

        return () => {};
    }, []);

    const menu = [
        // {
        //     name: '新建',
        //     value: 'new',
        //     handle: () => {
        //         setVisible(false);
        //     },
        // },
        {
            name: '排序',
            value: 'sort',
            handle: () => {
                emit$(EVENT_TYPE.BAR_SORT);
                setVisible(false);
            },
        },
    ];

    return (
        <div
            className={styles['context-menu-wrapper']}
            style={{
                display: visible ? 'block' : 'none',
            }}
            onClick={e => {
                e.stopPropagation();
                setVisible(false);
            }}>
            <div
                className={styles['context-menu']}
                style={{
                    left: position[0],
                    top: position[1],
                    display: visible ? 'block' : 'none',
                }}>
                {menu.map(item => (
                    <div
                        key={item.value}
                        onClick={item.handle}
                        className={styles['context-item']}>
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
