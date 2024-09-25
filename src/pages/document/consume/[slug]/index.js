import React, { useEffect, useState } from 'react';
import { PDFViewer, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { getLocal } from '../../../../modules/storages/local';
import Swal from 'sweetalert2';
import { getTodayDate } from '../../../../modules/helpers/generator';
import ComponentAlertBox from '../../../../molecules/alert_box';

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
    padding: 10,
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

  useEffect(() => {
    fetchConsume()
  },[])

  const fetchConsume = () => {
    fetch('http://127.0.0.1:8000/api/v1/consume/detail/'+params.slug, {
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
        setError(error)
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
              <Text style={styles.content_title}>{item.consume_name}</Text>
              <Text style={styles.content_body}>{item.consume_comment ?? '-'}</Text>
              <View style={styles.br} />

              <Text style={styles.content_title}>Detail</Text>
              <Text style={styles.content_body}>Main Ingredient : {item.consume_detail[0]['main_ing']}</Text>
              <Text style={styles.content_body}>Calorie: {item.consume_detail[0]['calorie']} Cal</Text>
              <Text style={styles.content_body}>Provide By: {item.consume_detail[0]['provide']}</Text>

              <View style={styles.br} />
              <Text style={styles.content_title}>Props</Text>
              <Text style={styles.content_body}>Created At : {item.created_at}</Text>
              <Text style={styles.content_body}>Updated At: {item.updated_at ?? '-'}</Text>

              <View style={styles.br} />
              <Text style={styles.content_title}>Payment History</Text>

              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>Method</Text>
                  <Text style={styles.tableCell}>Amount</Text>
                  <Text style={styles.tableCell}>Created At</Text>
                </View>

                {item.payment.map((dt, idx) => (
                  <View style={styles.tableRow} key={idx}>
                    <Text style={styles.tableCell}>{dt.payment_method}</Text>
                    <Text style={styles.tableCell}>{dt.payment_price}</Text>
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
