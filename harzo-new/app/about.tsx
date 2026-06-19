import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";

import Constants from "expo-constants";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Harzo</Text>

      <Text style={styles.version}>
        Version {Constants.expoConfig?.version}
      </Text>

      <Text style={styles.heading}>
        Welcome to Harzo!
      </Text>

      <Text style={styles.text}>
        Harzo is a smart online shopping and local
        delivery platform designed to make shopping
        easy, fast, and convenient for everyone.
      </Text>

      <Text style={styles.heading}>
        Features
      </Text>

      <Text style={styles.text}>
        • Browse products easily{"\n"}
        • Search products instantly{"\n"}
        
        • Save delivery address{"\n"}
        • Secure payments{"\n"}
        • Fast local delivery{"\n"}
        • Notifications and updates
      </Text>

    <Text style={styles.heading}>
    About Harzo
</Text>

      <Text style={styles.text}>
        Harzo is not just an application for me. It is a dream, a journey, and a story of hope, struggle, and belief.

        {"\n\n"}

        This dream started when I went to Hyderabad for work. During that time, I saw apps like Blinkit and BigBasket and I was amazed by how easily people could order things and get them delivered quickly.

        {"\n\n"}

        At that moment, a thought came into my mind:

        {"\n\n"}

        "Why not create something like this for my village?"

        {"\n\n"}

        In my area, people often had to travel 2–3 km even for small daily needs. I wanted to make life easier for people.

        {"\n\n"}

        Having an idea was easy, but turning it into reality was very difficult.

        {"\n\n"}

        I had plans and dreams, but I had no money and very little support. There were many moments when I felt worried and confused.

        {"\n\n"}

        Then one day I shared my idea with my college friend Vaibhav Dilip Turankar. He became the first person who truly believed in me and supported my dream.

        {"\n\n"}

        To build the app, we needed a laptop badly, but we did not have enough money. Later my sister Shital Uikey stepped forward and helped us get a laptop through her card.

        {"\n\n"}

        To pay the laptop EMI, I started working outside, but because of work I was not getting enough time for my dream. After around two months, I decided to leave the job and focus on Harzo.

        {"\n\n"}

        The journey was never easy. I am only a 12th pass student, and I had even failed English during my school days. Understanding many things was difficult for me, but I never stopped learning and trying.

        {"\n\n"}

        When Harzo was almost ready, we needed more support. At that stage, Ramesh Yelpulwar Sir supported and encouraged us.

        {"\n\n"}

        Finally, I want to express my deepest gratitude to Sarswathi . I truly believe that without this support, I would never have reached this stage.

        {"\n\n"}

        I would also like to thank ChatGPT, which became a learning partner throughout my coding journey. It helped me understand coding concepts, solve problems, and continue building when many things felt difficult.

        {"\n\n"}

        Today Harzo is not just an app. It is a result of dreams, sacrifices, hard work, support, and belief.

        {"\n\n"}

        This is only the beginning, and there is still a long journey ahead.

        {"\n\n"}

        Thank you for being part of this journey ❤️
      </Text>

      <Text style={styles.copy}>
        © 2026 Harzo. All rights reserved.
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
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },

  version: {
    fontSize: 16,
    textAlign: "center",
    color: "gray",
    marginBottom: 25,
  },

 heading: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
    color: "#222",
},

text: {
    fontSize: 13,
    lineHeight: 32,
    color: "#444",
},

copy: {
    textAlign: "center",
    marginTop: 30,
    marginBottom: 90,
    color: "gray",
},
});