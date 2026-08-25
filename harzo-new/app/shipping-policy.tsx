import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";

export default function ShippingPolicy() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 80,
      }}
    >
      <Text style={styles.title}>
        Shipping Policy
      </Text>

      <Text style={styles.heading}>
        1. Delivery Areas
      </Text>

      <Text style={styles.text}>
        Harzo sirf unhi locations par delivery provide karta hai jo Harzo delivery network me available hain. Delivery availability customer ke village, area aur pincode ke basis par check ki jati hai.
      </Text>

      <Text style={styles.heading}>
        2. Delivery Time
      </Text>

      <Text style={styles.text}>
        Delivery time location ke hisab se alag ho sakta hai. Customer ke area ke liye applicable estimated delivery time Harzo app ke header me display kiya jata hai. Delivery time traffic, weather, order volume aur other operational reasons ke karan vary ho sakta hai.
      </Text>

      <Text style={styles.heading}>
        3. Delivery Charges
      </Text>

      <Text style={styles.text}>
        Delivery charges area-wise settings ke hisab se apply kiye jate hain. Applicable delivery charge checkout page par order place karne se pehle clearly display kiya jata hai.
      </Text>

      <Text style={styles.heading}>
        4. Free Delivery
      </Text>

      <Text style={styles.text}>
        Kuch locations par minimum order value complete karne par free delivery available ho sakti hai. Free delivery eligibility checkout ke dauran display ki jayegi.
      </Text>

      <Text style={styles.heading}>
        5. High Value Orders
      </Text>

      <Text style={styles.text}>
        ₹10,000 ya usse adhik ke eligible orders ke liye delivery charge ya applicable logistics charges advance me online collect kiye ja sakte hain.
      </Text>

      <Text style={styles.heading}>
        6. Failed Delivery
      </Text>

      <Text style={styles.text}>
        Agar customer delivery address par available nahi hota, galat address provide karta hai, ya delivery receive karne se mana karta hai, to order cancel kiya ja sakta hai aur applicable delivery charges non-refundable ho sakte hain.
      </Text>

      <Text style={styles.heading}>
        7. Delivery Delays
      </Text>

      <Text style={styles.text}>
        Harzo estimated delivery timelines ko maintain karne ka prayas karta hai. Lekin weather conditions, traffic, technical issues, public holidays ya other unforeseen circumstances ke karan delay ho sakta hai.
      </Text>

      <Text style={styles.heading}>
        8. Order Tracking & Support
      </Text>

      <Text style={styles.text}>
        Delivery se sambandhit kisi bhi query ke liye customer Harzo customer support se contact kar sakta hai. Harzo order status aur delivery updates provide karne ka prayas karega.
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