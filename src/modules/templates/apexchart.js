Cypress.Commands.add('templateApexChart', (type, items) => {
    // Test
    cy.get('div[class*=apexcharts-legend]').should('exist') // Have chart legend
    cy.get('g[class*=apexcharts-datalabels]').should('exist') // Have chart label

    if(type == 'pie' || type == 'line' || type == 'bar'){

        // Have same total between chart label and chart series (area)
        cy.get('g[class*=apexcharts-datalabels]').its('length').then(dtlabelsLen => {
            cy.get(`g[class*=apexcharts-${type}-series]`).its('length').then(pieSrsLen => {
                expect(dtlabelsLen).to.equal(pieSrsLen)
            });
        });

        if(type == 'pie'){

            // Have total percentage of label equal to 100%
            let totalPercentage = 0
            cy.get('[class*=apexcharts-pie-label]').each(($el, index, $list) => {
                const percent = $el.text().trim().replace("%", "")
                totalPercentage += parseFloat(percent)
            }).then(() => {
                expect(Math.trunc(totalPercentage)).to.equal(100)
            });
        }

        if(type == 'line' || type == 'bar'){
            let axis = ''
            if(type == 'line'){
                axis ='y'
            } else if(type == 'bar'){
                axis ='x'
            }

            // All data value are in area below the maximum lable n more than minumum
            cy.get(`[class*=apexcharts-${axis}axis-label]`).first().find('title').invoke('text').then(max => {
                cy.get(`[class*=apexcharts-${axis}axis-label]`).last().find('title').invoke('text').then(min => {
                    items.forEach(el => {
                        if(type == 'line'){
                            cy.wrap(el.total_ammount).should('be.gt', parseInt(min)).should('be.lt', parseInt(max))
                        } else if(type == 'bar') {
                            cy.wrap(el.total).should('be.gt', parseInt(min)).should('be.lt', parseInt(max))
                        }
                    });
                });
            });
        }
    }
});
