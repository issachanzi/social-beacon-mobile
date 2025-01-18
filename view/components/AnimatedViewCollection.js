import Animated, * as Rnra from 'react-native-reanimated';
import {Easing} from 'react-native-reanimated';
import {Dimensions, View} from 'react-native';
import React, {useState} from 'react';

const STATE_NEW = 0;
const STATE_ACTIVE = 1;
const STATE_REMOVE_PENDING = 2
const STATE_REMOVE_ANIMATING = 3;
const STATE_REMOVE_FINISHED = 4;

const ANIMATION_DURATION_MILLIS = 300;

export default function AnimatedViewCollection ({ items }) {
    const [currentItems, setCurrentItems] = useState([]);

    React.useEffect(() => {
        setCurrentItems(diff (currentItems, items));
    }, [items]);

    if (currentItems === null) {
        return <></>;
    }

    return (currentItems.map (item => (
        <AnimatedViewEntry
            state={item.state}
            key={item.key}
            onChangeState={newState => setCurrentItems(
                currentItems.map (i => ({
                    ...i,
                    state: i.id === item.id ? newState : i.state
                }))
            )}
        >
            {item.element}
        </AnimatedViewEntry>
    )));
}

function AnimatedViewEntry ({state, children, onChangeState}) {
    const [layoutHeight, setLayoutHeight] = useState(0);
    const [currentState, setCurrentState] = useState(state);

    const slideAnim = Rnra.useSharedValue (1);
    const scrollAnim = Rnra.useSharedValue (0);

    React.useEffect(() => {
        if (currentState === STATE_NEW) {
            scrollAnim.value = Rnra.withTiming (
                1,
                {
                    duration: ANIMATION_DURATION_MILLIS / 2
                }
            );
            slideAnim.value = Rnra.withDelay (
                ANIMATION_DURATION_MILLIS / 2,
                Rnra.withTiming (
                    0,
                    {
                        duration: ANIMATION_DURATION_MILLIS / 2,
                        easing: Easing.out (Easing.ease)
                    }
                )
            );

            setCurrentState (STATE_ACTIVE);
            onChangeState (STATE_ACTIVE);
        }
        else if (state === STATE_REMOVE_PENDING) {
            slideAnim.value = Rnra.withTiming (
                -1,
                {
                    duration: ANIMATION_DURATION_MILLIS / 2,
                    easing: Easing.in (Easing.ease)
                }
            );
            scrollAnim.value = Rnra.withDelay(
                ANIMATION_DURATION_MILLIS / 2,
                Rnra.withTiming (
                    0,
                    {
                        duration: ANIMATION_DURATION_MILLIS / 2,
                    }
                )
            );

            setCurrentState (STATE_REMOVE_ANIMATING);
            onChangeState (STATE_REMOVE_ANIMATING);

            setTimeout (() => {
                setCurrentState (STATE_REMOVE_FINISHED);
                onChangeState (STATE_REMOVE_FINISHED);
            }, ANIMATION_DURATION_MILLIS);
        }
    }, [currentState]);

    React.useEffect(() => {
        if (state > currentState) {
            setCurrentState(state);
        }
    }, [state]);

    const handleLayout = event => {
        setLayoutHeight (event.nativeEvent.layout.height);
    };

    const windowWidth = Dimensions.get('window').width;

    const style = Rnra.useAnimatedStyle (() => ({
        transform: [
            {
                translateX: Rnra.interpolate (
                    slideAnim.value,
                    [0, 1],
                    [0, windowWidth]
                )
            }
        ],
        opacity: Rnra.interpolate(
            slideAnim.value,
            [-1, 0, 1],
            [0, 1, 0]
        ),
        height: Rnra.interpolate (
            scrollAnim.value,
            [0, 1],
            [0, layoutHeight]
        )
    }), [windowWidth, layoutHeight]);

    return (
        <>
            <View
                onLayout={handleLayout}
                style={{
                    position: 'absolute',
                    opacity: 0,
                    zIndex: -1
                }}
            >
                {children}
            </View>
            <Animated.View style={style}>
                {children}
            </Animated.View>
        </>
    );
}

function diff (oldList, newList) {
    const IN_OLD = 0b00000001;
    const IN_NEW = 0b00000010;
    const IN_BOTH = IN_OLD | IN_NEW;

    const itemsInLists = {};
    oldList.forEach(item => {
        if (item.state !== STATE_REMOVE_FINISHED) {
            itemsInLists[item.key] |= IN_OLD;
        }
    });
    newList.forEach(item => itemsInLists[item.key] |= IN_NEW);

    const resultList = [];

    let oldIndex = 0;
    let newIndex = 0;
    let finished = false;
    while (!finished) {
        const oldItem = oldIndex < oldList.length ? oldList[oldIndex] : null;
        const newItem = newIndex < newList.length ? newList[newIndex] : null;
        if (oldItem && oldItem.state === STATE_REMOVE_FINISHED) {
            oldIndex++;
        }
        else if (oldItem && itemsInLists[oldItem.key] !== IN_BOTH) {
            if (oldItem.state < STATE_REMOVE_PENDING) {
                oldItem.state = STATE_REMOVE_PENDING;
            }
            resultList.push(oldItem);
            oldIndex++;
        }
        else if (newItem && itemsInLists[newItem.key] !== IN_BOTH) {
            resultList.push({
                ...newItem,
                state: STATE_NEW
            });
            newIndex++;
        }
        else if (oldItem && newItem && oldItem.key === newItem.key) {
            resultList.push({
                ...newItem,
                state: STATE_NEW
            });
            oldIndex++;
            newIndex++;
        }
        else {
            finished = true;
        }
    }

    return resultList;
}

