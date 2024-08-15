import {useEffect, useState} from "react";

function getWindowDimensions() {
    const {pageYOffset: yOffset} = window;
    return {
        yOffset,
    };
}

const useScroll = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize(e) {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('scroll', handleResize);
        return () => window.removeEventListener('scroll', handleResize);
    }, []);

    return windowDimensions;
}

export default useScroll;