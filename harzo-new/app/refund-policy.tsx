import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";

export default function RefundPolicy() {
  return (
    <ScrollView
  style={styles.container}
  contentContainerStyle={{
    paddingBottom: 80,
  }}
>

      <Text style={styles.title}>
        Refund & Return Policy
      </Text>

      <Text style={styles.heading}>
        1. Return Eligibility
      </Text>

      <Text style={styles.text}>
        Return request sirf damaged, defective ya incorrect product deliver hone par hi accept ki jayegi. Normal condition me delivered products return nahi kiye jayenge.
      </Text>

      <Text style={styles.heading}>
        2. Replacement Policy
      </Text>

      <Text style={styles.text}>
        Approved return cases me Harzo customer ko replacement product provide karega (subject to availability). Sirf customer ki request par cash refund nahi diya jayega.
      </Text>

      <Text style={styles.heading}>
        3. High Value Orders
      </Text>

      <Text style={styles.text}>
        ₹10,000 ya usse adhik ke eligible orders ke liye delivery charge advance me online pay karna pad sakta hai.
      </Text>

      <Text style={styles.heading}>
        4. Customer Cancellation
      </Text>

      <Text style={styles.text}>
        Agar order dispatch hone ke baad customer order cancel karta hai ya delivery boy address par pahunchne ke baad order receive karne se mana karta hai, to delivery charge deduct kiya jayega. Agar customer ne advance payment ki hai, to delivery charge kaatkar baaki eligible amount refund kiya jayega.
      </Text>

      <Text style={styles.heading}>
        5. Company or Delivery Partner Fault
      </Text>

      <Text style={styles.text}>
        Agar order cancel ya delivery fail hone ka reason Harzo, seller ya delivery partner ki galti ho, to customer ko poora refund diya jayega aur koi delivery charge deduct nahi kiya jayega.
      </Text>

      <Text style={styles.heading}>
        6. Verification
      </Text>

      <Text style={styles.text}>
        Har return request verification ke baad hi approve ki jayegi. Harzo ko return ya replacement request reject karne ka adhikar hoga agar policy ki conditions puri nahi hoti hain.
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 25,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 15,
    marginBottom: 8,
  },

  text: {
    fontSize: 16,
    lineHeight: 28,
    color: "#4B5563",
    marginBottom: 12,
  },
});