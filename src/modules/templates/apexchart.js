const templateApexChart = (type, items) => {
    // Test
    expect(document.querySelector('div[class*=apexcharts-legend]')).toBeTruthy() // Have chart legend
    expect(document.querySelector('g[class*=apexcharts-datalabels]')).toBeTruthy() // Have chart label

    if (type == 'pie' || type == 'line' || type == 'bar') {

        // Have same total between chart label and chart series (area)
        const dtlabelsLen = document.querySelectorAll(`g[class*=apexcharts-datalabels]`).length
        const pieSrsLen = document.querySelectorAll(`g[class*=apexcharts-${type}-series]`).length
        expect(dtlabelsLen).toEqual(pieSrsLen)

        if (type == 'pie') {
            // Have total percentage of label equal to 100%
            let totalPercentage = 0
            document.querySelectorAll('[class*=apexcharts-pie-label]').forEach($el => {
                const percent = $el.textContent.trim().replace("%", "")
                totalPercentage += parseFloat(percent)
            })
            expect(Math.trunc(totalPercentage)).toEqual(100)
        }

        if (type == 'line' || type == 'bar') {
            let axis = ''
            if (type == 'line') {
                axis = 'y'
            } else if (type == 'bar') {
                axis = 'x'
            }

            // All data value are in area below the maximum label n more than minimum
            const max = document.querySelector(`[class*=apexcharts-${axis}axis-label]`).firstElementChild.textContent.trim()
            const min = document.querySelector(`[class*=apexcharts-${axis}axis-label]`).lastElementChild.textContent.trim()
            items.forEach(el => {
                if (type == 'line') {
                    expect(el.total_ammount).toBeGreaterThan(parseInt(min))
                    expect(el.total_ammount).toBeLessThan(parseInt(max))
                } else if (type == 'bar') {
                    expect(el.total).toBeGreaterThan(parseInt(min))
                    expect(el.total).toBeLessThan(parseInt(max))
                }
            })
        }
    }
}
  