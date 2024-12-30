import React from 'react';

export class Router {
    static FORWARD = 'forward';
    static BACK = 'back';

    static instance = null;

    stack = [];
    subscribers = [];

    use () {
        const [state, setState] = React.useState([
            this.stack.at (-1),
            undefined,
            undefined
        ]);

        React.useEffect(() => {
            this.subscribers.push(setState);
        }, []);

        return state;
    }

    pingSubscribers (oldView, newView, direction) {
        this.subscribers.forEach (setState => {
            setState ([oldView, newView, direction]);
        });
    }

    push (newView) {
        const oldView = this.stack.at(-1);

        this.stack.push (newView);

        this.pingSubscribers (oldView, newView, Router.FORWARD);
    }

    pop () {
        if (this.stack.length <= 1) {
            return;
        }

        const oldView = this.stack.pop ();
        const newView = this.stack.at (-1);

        this.pingSubscribers (oldView, newView, Router.BACK);
    }

    replace (newView) {
        const oldView = this.stack.at(-1);

        this.stack [this.stack.length - 1] = newView;

        this.pingSubscribers (oldView, newView, Router.FORWARD);
    }

    reset (newView) {
        const oldView = this.stack.at(-1);

        this.stack = [newView];

        this.pingSubscribers (oldView, newView, Router.BACK);
    }
}
