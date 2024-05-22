const CoverGreeting = ({color, className}) => {
    return (
        <h2 className={className}>
            Hey, thanks for <span style={{ color: color }}>crossing</span> by!
        </h2>
    )
}

export default CoverGreeting