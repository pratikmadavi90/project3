import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";

export default function RefundPolicy() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Refund & Return Policy</Text>

      <Text style={styles.text}>
        Damaged or incorrect products may be eligible for return.
      </Text>

      <Text style={styles.text}>
        Approved refunds will be processed according to Harzo policy.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:20},
  title:{fontSize:24,fontWeight:"700",marginBottom:20},
  text:{fontSize:16,lineHeight:24,marginBottom:12}
});