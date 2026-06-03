import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";

export default function PrivacyPolicy() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.text}>
        Harzo collects user information such as name,
        mobile number and address only for order processing
        and delivery purposes.
      </Text>

      <Text style={styles.text}>
        User information is kept secure and is not sold to
        third parties.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:20},
  title:{fontSize:24,fontWeight:"700",marginBottom:20},
  text:{fontSize:16,lineHeight:24,marginBottom:12}
});