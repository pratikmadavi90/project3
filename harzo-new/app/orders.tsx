import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMyReturns } from "../services/returnService";

const API = "https://api.harzo.in/api/orders";

export default function OrdersScreen() {

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
const [returns, setReturns] = useState([]);



  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ FETCH ORDERS
  const fetchOrders = async () => {

    try {

      // ✅ CURRENT USER
      const savedUser =
        await AsyncStorage.getItem("user");

      // ❌ NOT LOGGED IN
      if (!savedUser) {

        setOrders([]);
        setLoading(false);

        return;
      }

      const user = JSON.parse(savedUser);

     try {

 console.log("USER", user);

const returnRes =
await getMyReturns(
"USR1780106224010"
);

   console.log(
"RETURN RESPONSE:",
JSON.stringify(returnRes,null,2)
); 

  if (returnRes?.success) {

    setReturns(returnRes.data || []);

  }

} catch (err) {

  console.log(
    "RETURN ERROR:",
    err
  );

} 

      // ✅ LOCAL ORDERS
      const savedOrders =
        await AsyncStorage.getItem("orders");

      const localOrders = savedOrders
        ? JSON.parse(savedOrders)
        : [];

      // ✅ FILTER USER ORDERS
      const filteredLocalOrders =
        Array.isArray(localOrders)
          ? localOrders.filter(
              (item: any) =>
                item?.userEmail === user?.email ||
                item?.email === user?.email
            )
          : [];

      // ✅ API ORDERS
      let apiOrders: any[] = [];

      try {

        const response = await fetch(API);

        const data = await response.json();

        const allOrders =
          Array.isArray(data)
            ? data
            : data?.orders || [];

        apiOrders = allOrders.filter(
          (item: any) =>
            item?.userEmail === user?.email ||
            item?.email === user?.email
        );

      } catch (e) {

        console.log("API ERROR:", e);
      }

      // ✅ MERGE ORDERS
 const mergedOrders = [
  ...apiOrders,
  ...filteredLocalOrders,
];

// REMOVE DUPLICATES
const uniqueOrders =
mergedOrders.filter(
(item,index,self)=>{

const currentKey =
`${item?.items?.[0]?.name}-${item?.total}-${item?.createdAt}`;

return index ===
self.findIndex(
(t)=>

`${t?.items?.[0]?.name}-${t?.total}-${t?.createdAt}`

===

currentKey
);

}
);  

      // ✅ SORT NEWEST FIRST
      uniqueOrders.sort(
        (a: any, b: any) =>
          new Date(
            b?.createdAt || Date.now()
          ).getTime() -
          new Date(
            a?.createdAt || Date.now()
          ).getTime()
      );



      setOrders(uniqueOrders);

    } catch (error) {

      console.log(
        "ORDER FETCH ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // ✅ LOADING
  if (loading) {

    return (

      <View style={styles.loader}>

        <ActivityIndicator
          size="large"
          color="#22c55e"
        />

      </View>
    );
  }

  // ✅ EMPTY
  if (orders.length === 0) {

    return (

      <View style={styles.emptyContainer}>

        <Text style={styles.emptyEmoji}>
          📦
        </Text>

        <Text style={styles.emptyTitle}>
          No Orders Yet
        </Text>

        <Text style={styles.emptyText}>
          Your placed orders will appear here
        </Text>

      </View>
    );
  }

  return (

    <FlatList
      data={orders}

      keyExtractor={(
        item: any,
        index: number
      ) =>
        (
          item?._id ||
          item?.id ||
          index
        ).toString()
      }

      contentContainerStyle={
        styles.container
      }

      showsVerticalScrollIndicator={false}

      renderItem={({ item }: any) => (

        

        <View style={styles.card}>

          {/* HEADER */}

          <View style={styles.topRow}>

  <Text
  numberOfLines={1}
  style={styles.orderId}
>
  🛒 {item?.orderId || "Order"}
</Text>     

 <View
  style={[
    styles.statusBox,
    {
      backgroundColor:
        item?.status === "Delivered"
          ? "#dcfce7"
          : item?.status === "Packed"
          ? "#fef3c7"
          : item?.status === "Out for Delivery"
          ? "#dbeafe"
          : item?.status === "Accepted"
          ? "#ede9fe"
          : item?.status === "Cancelled"
          ? "#fee2e2"
          : "#fef9c3",
    },
  ]}
>

  <Text
    style={[
      styles.statusText,
      {
        color:
          item?.status === "Delivered"
            ? "#16a34a"
            : item?.status === "Packed"
            ? "#d97706"
            : item?.status === "Out for Delivery"
            ? "#2563eb"
            : item?.status === "Accepted"
            ? "#7c3aed"
            : item?.status === "Cancelled"
            ? "#dc2626"
            : "#ca8a04",
      },
    ]}
  >
    {item?.status || "Pending"}
  </Text>

</View>           

          </View>

          {/* DATE */}

          <Text style={styles.date}>
            📅{" "}
            {
              item?.createdAt
                ? new Date(
                    item.createdAt
                  ).toLocaleDateString()
                : "Today"
            }
          </Text>

          {/* TIME */}

          <Text style={styles.time}>
            ⏰{" "}
            {
              item?.createdAt
                ? new Date(
                    item.createdAt
                  ).toLocaleTimeString()
                : ""
            }
          </Text>

          {/* PRODUCTS */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 14 }}
          >

            {
              item?.items?.map(
                (
                  product: any,
                  index: number
                ) => (

                  <View
                    key={index}
                    style={
                      styles.productCard
                    }
                  >

                    <Image
                      source={{
                        uri:
                          product?.image ||
                          product?.images
                            ?.thumbnail ||
                          "https://dummyimage.com/100x100/cccccc/000000.png",
                      }}

                      style={styles.image}
                    />

                    <View
                      style={
                        styles.details
                      }
                    >

                      <Text
                        numberOfLines={1}
                        style={
                          styles.title
                        }
                      >
                        {
                          product?.name ||
                          "Product"
                        }
                      </Text>

                      <Text
                        style={
                          styles.price
                        }
                      >
                        ₹
                        {
                          product?.price ||
                          product?.pricing
                            ?.sellingPrice ||
                          0
                        }
                      </Text>

                      <Text
                        style={styles.qty}
                      >
                        Qty:{" "}
                        {
                          product?.quantity ||
                          product?.qty ||
                          1
                        }
                      </Text>

                    </View>

                  </View>
                )
              )
            }

          </ScrollView>

          {/* INFO */}

          <View style={styles.infoBox}>

            <Text style={styles.orderText}>
              💳 Payment:{" "}
              {
                item?.paymentMethod ||
                "Cash On Delivery"
              }
            </Text>
            <Text style={styles.orderText}>
  🚚 Delivery:{" "}
  {
    item?.address?.fullAddress
      ? `${item.address.fullAddress}, ${item.address.city} - ${item.address.pincode}`
      : item?.deliveryAddress || "Korpana"
  }
</Text>

            <Text style={styles.total}>
              Total: ₹
              {
                item?.total ||
                item?.totalAmount ||
                0
              }
            </Text>

          </View>

{
returns.length > 0 ? (

<View style={styles.returnBtn}>
<Text style={styles.returnBtnText}>
↩ Return Requested
</Text>
</View>

) : (

<TouchableOpacity
style={styles.returnBtn}

onPress={()=>
router.push({
pathname:"/return-request",
params:{
orderId:item?.orderId || item?._id,

userId:
item?.userId ||
item?.user?._id ||
"",

userName:
item?.user?.name || "",

mobile:
item?.user?.phone || "",

address:
`${item?.address?.fullAddress || ""}
 ${item?.address?.city || ""}
 ${item?.address?.pincode || ""}`,

productName:
item?.items?.map(
(p)=>p?.name
).join(", "),

quantity:
item?.items?.reduce(
(sum,p)=>
sum + (p?.quantity || p?.qty || 1),
0
)
}
})
}
>

<Text style={styles.returnBtnText}>
↩ Return Product
</Text>

</TouchableOpacity>

)
}

        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({

container: {
  paddingHorizontal: 16,
  paddingTop: 40,
  paddingBottom: 100,
  backgroundColor: "#f1f5f9",
},

  card: {
    backgroundColor: "#fff",

    borderRadius: 24,

    padding: 16,

    marginBottom: 18,

    shadowColor: "#000",

    shadowOpacity: 0.06,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

topRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

orderId: {
  fontSize: 11,
  fontWeight: "800",
  color: "#111827",
  width: "72%",
},

statusBox: {
  backgroundColor: "#dcfce7",
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 30,
},

  statusText: {
    color: "#16a34a",
    fontWeight: "700",
    fontSize: 13,
  },

  date: {
    marginTop: 10,
    color: "#64748b",
    fontSize: 13,
  },

  time: {
    marginTop: 3,
    color: "#64748b",
    fontSize: 13,
  },

  productCard: {
    flexDirection: "row",

    backgroundColor: "#f8fafc",

    borderRadius: 18,

    padding: 10,

    marginRight: 14,

    width: 260,
  },

  image: {
    width: 88,
    height: 88,

    borderRadius: 16,

    backgroundColor: "#eee",
  },

  details: {
    marginLeft: 12,
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  price: {
    marginTop: 6,
    fontSize: 16,
    color: "#16a34a",
    fontWeight: "700",
  },

  qty: {
    marginTop: 5,
    color: "#475569",
    fontSize: 14,
  },

  infoBox: {
    marginTop: 16,

    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",

    paddingTop: 14,
  },

  orderText: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 7,
  },

  total: {
    fontSize: 18,
    color: "#111827",
    fontWeight: "800",
    marginTop: 8,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    padding: 20,
  },

  emptyEmoji: {
    fontSize: 58,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },

  emptyText: {
    marginTop: 10,
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
  },

  returnBtn:{
backgroundColor:"#ef4444",
padding:10,
borderRadius:12,
marginTop:12,
alignItems:"center",
},

returnBtnText:{
color:"#fff",
fontSize:16,
fontWeight:"700",
},

});