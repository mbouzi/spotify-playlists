import { useState, useEffect } from "react";

export const useStrictDroppable = (loading: boolean): boolean[] => {
    const [enabled, setEnabled] = useState<boolean>(false);

    useEffect(() => {
        let animation: number;

        if (!loading) {
            animation = requestAnimationFrame(() => setEnabled(true));
        }

        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, [loading]);

    return [enabled];
};