import React from 'react'

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
  