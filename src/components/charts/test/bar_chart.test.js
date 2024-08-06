import React from 'react'
import ComponentBarChart from '../bar_chart'
import '../../../modules/templates/apexchart.js'
import { render } from '@testing-library/react'

describe('Bar Chart Component Testing', () => {
  window.ResizeObserver = ResizeObserver

  it('TCC-C3 Get Bar Chart Without Filter', () => {
    const type = 'bar'
    const items = [
      {
        context:"Quartal 1",
        total: 30
      },
      {
        context:"Quartal 2",
        total: 22
      },
      {
        context:"Quartal 3",
        total: 41
      },
      {
        context:"Quartal 4",
        total: 36
      }
    ]

    render(<ComponentBarChart items={items} filter_name={null} />)
    templateApexChart(type, items)
  })
})