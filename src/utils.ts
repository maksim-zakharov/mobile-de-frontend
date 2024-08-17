export const virtualListStyles : {
    horizontalScrollBar?: React.CSSProperties;
    horizontalScrollBarThumb?: React.CSSProperties;
    verticalScrollBar?: React.CSSProperties;
    verticalScrollBarThumb?: React.CSSProperties;
} = {
    verticalScrollBar: {
        width: 'calc(var(--scrollbar-width) - 2px)',
        height: 'var(--scrollbar-width)',
        background: 'rgba(var(--scrollbars-bg-color), var(--scrollbars-bg-opacity))',
        cursor: 'pointer'
    },
    verticalScrollBarThumb: {
        border: '2px solid transparent',
        backgroundColor: "rgba(var(--scrollbars-thumb-color), var(--scrollbars-thumb-opacity))",
        backgroundClip: "padding-box",
        borderRadius: "5px",
        cursor: "pointer",
        // -webkit-transition: "background-color .2s ease-in",
        transition: "background-color .2s ease-in"
    }
}