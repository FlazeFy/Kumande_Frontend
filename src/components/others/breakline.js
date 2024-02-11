export default function GetBreakLine({length}) {
    const builder = Array(length).fill(1)

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
  