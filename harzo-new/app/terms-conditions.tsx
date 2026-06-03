import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";

export default function TermsConditions() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms & Conditions</Text>

      <Text style={styles.text}>
        By using Harzo, users agree to our terms and conditions.
      </Text>

      <Text style={styles.text}>
        Product availability and prices may change without notice.
      </Text>

      <Text style={styles.text}>
        Users must provide correct delivery information.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:20},
  title:{fontSize:24,fontWeight:"700",marginBottom:20},
  text:{fontSize:16,lineHeight:24,marginBottom:12}
});