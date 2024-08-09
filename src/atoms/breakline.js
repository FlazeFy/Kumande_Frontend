import React from 'react'

/**
 * This component renders a specified number of line breaks (`<br>`) based on the `length` prop.
 *
 * @component
 * @example
 * ```jsx
 * <ComponentBreakLine length={3} />
 * ```
 * @param {Object} props - The props object
 * @param {number} props.length - The number of line breaks to render
 * 
 * @returns {React.Element}
 */
export default function ComponentBreakLine(props) {
    const builder = Array(props.length).fill(1)

    return (
        <>
            {
                builder.map((_) => {
                    return <br></br>
                })
            }
        </>
    )
}
  