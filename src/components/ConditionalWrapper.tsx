import React from "react";

interface ConditionalWrapperProps {
    condition: boolean | null | undefined;
    wrapperA: (children: React.ReactNode | string) => React.ReactElement;
    wrapperB: (children: React.ReactNode | string) => React.ReactElement;
    children: React.ReactNode | string;
}


const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({condition, wrapperA, wrapperB, children}): React.ReactNode => {
    if(condition) {
        return wrapperA(children);
    } else return wrapperB(children)
};

export default ConditionalWrapper;