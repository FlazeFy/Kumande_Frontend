import React, { useEffect, useState } from 'react';
import { PDFViewer, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { getLocal } from '../../../../modules/storages/local';
import Swal from 'sweetalert2';
import { getTodayDate } from '../../../../modules/helpers/generator';
import ComponentAlertBox from '../../../../molecules/alert_box';
import { numberToPrice } from '../../../../modules/helpers/converter';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  section: {
    margin: 10,
    paddingVertical: 6,  
},
  title: {
    fontSize: 18,
    color: '#00A7EA',
  },
  subtitle: {
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#5B5B5B',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  hr: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  br: {
    marginVertical: 10,
  },
  content_title: {
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  content_body: {
    fontSize: '11px'
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 10,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    border: '1px solid #000',
    padding: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
});

export default function DocumentPage({ params }){
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [item, setItem] = useState(null)
  const token = getLocal("token_key")
  const month_year = params.month_year.split('_')

  useEffect(() => {
    fetchConsume()
  },[])

  const fetchConsume = () => {

    fetch(`http://127.0.0.1:8000/api/v1/payment/detail/month/${month_year[0]}/year/${month_year[1]}?all=true`, {
      headers: {
          Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
        .then(
        (result) => {
            setIsLoaded(true)
            setItem(result.data)        
        },
        (error) => {
            Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            })
        }
    )
  }

  if (error) {
    return <ComponentAlertBox message={error.message} type='danger' context={'Detail consume'}/>
  } else if (!isLoaded) {
      return (
        <div>
            <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
        </div>
      )
  } else {
    return (
      <PDFViewer width="100%" height="800">
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.title}>Kumande</Text>
              <Text style={styles.subtitle}>
                - Make food scheduling, analyze it, tracking, and choose your meals for tomorrow -
              </Text>
            </View>
            <View style={styles.hr} />
              <Text style={styles.content_title}>Payment History</Text>
              <Text style={styles.content_body}>Month : {month_year[0]}</Text>
              <Text style={styles.content_body}>Year: {month_year[1]}</Text>

              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>Consume Name</Text>
                  <Text style={styles.tableCell}>Consume Type</Text>
                  <Text style={styles.tableCell}>Method</Text>
                  <Text style={styles.tableCell}>Price</Text>
                  <Text style={styles.tableCell}>Created At</Text>
                </View>

                {item.map((dt, idx) => (
                  <View style={styles.tableRow} key={idx}>
                    <Text style={styles.tableCell}>{dt.consume_name}</Text>
                    <Text style={styles.tableCell}>{dt.consume_type}</Text>
                    <Text style={styles.tableCell}>{dt.payment_method}</Text>
                    <Text style={styles.tableCell}>Rp. {numberToPrice(dt.payment_price)}</Text>
                    <Text style={styles.tableCell}>{dt.created_at}</Text>
                  </View>
                ))}
              </View>
            <View style={styles.hr} />
            <View style={styles.section}>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={{fontSize:"11px"}}>Parts of FlazenApps</Text>
                </View>
                <View style={styles.column}>
                  <Text style={{fontSize:"11px"}}>Generated at {getTodayDate('yyyy-MM-dd H:i')}</Text>
                </View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    )
  }
}

export const Head = () => <title>History Page</title>
