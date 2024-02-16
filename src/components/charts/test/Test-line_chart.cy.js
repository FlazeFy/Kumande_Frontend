import React from 'react'
import GetLineChart from '../line_chart'
import '../../../modules/templates/apexchart.js'

describe('Line Chart Component Testing', () => {
  it('TCC-C2 Get Line Chart Without Filter', () => {
    const type = 'line'
    const items = [
      {
        context:"Quartal 1",
        total_ammount: 30
      },
      {
        context:"Quartal 2",
        total_ammount: 22
      },
      {
        context:"Quartal 3",
        total_ammount: 41
      },
      {
        context:"Quartal 4",
        total_ammount: 36
      }
    ]

    sessionStorage.setItem("flow_type",'TCC-C2')
    cy.mount(<GetLineChart items={items} filter_name={null} />)

    // Template Apexchart test
    cy.templateApexChart(type, items)
  })
})