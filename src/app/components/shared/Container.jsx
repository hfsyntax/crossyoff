const Container = ({id, className, children}) => {
    return (
        <div id={id} className={className}>{children}</div>
    )
}

export default Container