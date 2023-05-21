import { useEffect, useState } from "react"

export default function useHeight() {
    const [height, setHeight] = useState(0)
    const handleResize = () => setHeight(window.innerHeight)
    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return height
}
