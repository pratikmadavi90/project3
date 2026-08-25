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
  Dimensions,
  RefreshControl,
} from "react-native";

import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMyReturns } from "../services/returnService";

const API = "https://api.harzo.in/api/orders";

const { width } = Dimensions.get("window");

export default function OrdersScreen() {

const [orders, setOrders] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [returns, setReturns] = useState([]);
const [productIndex, setProductIndex] = useState({});


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
user.userId
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
      let footwearOrders: any[] = [];

      try {

const response = await fetch(
  `https://api.harzo.in/api/orders/user/${encodeURIComponent(user.email)}`
);

const data = await response.json();

console.log("USER ORDERS:", data);

apiOrders = data?.data || []; 



try {

const footwearRes = await fetch(
  `https://api.harzo.in/api/footwear-orders/user/${encodeURIComponent(user.email)}`
);

const footwearData = await footwearRes.json();

console.log("FOOTWEAR ORDERS:", footwearData);

footwearOrders = footwearData?.data || [];

} catch (err) {

console.log("FOOTWEAR ERROR:", err);

}

      } catch (e) {

        console.log("API ERROR:", e);
      }

      // ✅ MERGE ORDERS
const mergedOrders = [
  ...apiOrders,
  ...footwearOrders,
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

const onRefresh = async () => {
  setRefreshing(true);

  await fetchOrders();

  setRefreshing(false);
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
  keyExtractor={(item, index) =>
    (item?._id || item?.id || index).toString()
  }
  contentContainerStyle={styles.container}
  showsVerticalScrollIndicator={false}

  refreshing={refreshing}
  onRefresh={onRefresh}

  renderItem={({ item }) => {

 const key = item?.orderId || item?._id;

const currentIndex =
  (productIndex as any)[key] || 0;

const currentProduct =
  item?.items?.[currentIndex] || {
    name: item?.productName,
    image: item?.productImage,
    price: item?.sellingPrice,
    quantity: 1,
  };

    console.log(
  "CURRENT PRODUCT =",
  JSON.stringify(currentProduct, null, 2)
);


  return (

        

        <TouchableOpacity
  style={styles.card}
  activeOpacity={0.9}

>

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
    {
  item?.status === "Out for Delivery"
    ? "On the Way"
    : item?.status || "Pending"
}
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

<View style={styles.productCard}>

<Image
  source={{
    uri:
      currentProduct?.image ||
      currentProduct?.images?.[0] ||
      currentProduct?.productImage ||
      "https://dummyimage.com/100x100/cccccc/000000.png",
  }}
  style={styles.image}
/>

  <View style={styles.details}>

    <Text numberOfLines={1} style={styles.title}>
      {currentProduct?.name}
    </Text>

    <Text style={styles.price}>
      ₹{currentProduct?.price || currentProduct?.pricing?.sellingPrice || 0}
    </Text>

    <Text style={styles.qty}>
      Qty: {currentProduct?.quantity || currentProduct?.qty || 1}
    </Text>

    {(item?.items?.length || 0) > 1 && (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: 90,
          marginTop: 8,
        }}
      >

<TouchableOpacity
  onPress={() => {
    if (currentIndex > 0) {
      setProductIndex((prev: any) => ({
        ...prev,
        [key]: currentIndex - 1,
      }));
    }
  }}
>
  <Text style={{ fontSize: 22 }}>◀</Text>
</TouchableOpacity>

 <TouchableOpacity
  onPress={() => {
    if (currentIndex < item.items.length - 1) {
      setProductIndex((prev: any) => ({
        ...prev,
        [key]: currentIndex + 1,
      }));
    }
  }}
>
  <Text style={{ fontSize: 22 }}>▶</Text>
</TouchableOpacity>

      </View>
    )}

  </View>

</View>

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

      : item?.address
      ? `${item.address}, ${item.city || ""} - ${item.pincode || ""}`

      : item?.deliveryAddress || "Address Not Available"
  }
</Text>

<Text style={styles.total}>
  Total: ₹
  {
    item?.total ||
    item?.totalAmount ||
    item?.sellingPrice ||
    0
  }
</Text>

          </View>

{
returns.some(
(r: any) => r?.orderId === item?.orderId
) ? (

<View style={styles.returnBtn}>
  <Text style={styles.returnBtnText}>
    ↩ Return Requested
  </Text>
</View>

) : (

<TouchableOpacity
  style={styles.returnBtn}
  onPress={() =>
    router.push({
      pathname: "/order-details",
      params: {
        orderId: item?.orderId || item?._id,



       userId:
       item?.userId || "",



        userName:
          item?.user?.name || "",

        mobile:
          item?.user?.phone || "",

        address:
`${item?.address?.fullAddress || ""}
${item?.address?.city || ""}
${item?.address?.pincode || ""}`,

        productName:
          item?.items
            ?.map((p: any) => p?.name)
            .join(", "),

        quantity:
          item?.items?.reduce(
            (sum: number, p: any) =>
              sum + (p?.quantity || p?.qty || 1),
            0
          ),
      },
    })
  }
>
<Text style={styles.returnBtnText}>
  📄 Order Details
</Text>
</TouchableOpacity>

)
}

     </TouchableOpacity>
    );
     }}
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
  flex: 1,
  fontSize: 11,
  fontWeight: "800",
  color: "#111827",
  marginRight: 8,
},

statusBox: {
  backgroundColor: "#dcfce7",
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 30,

  marginLeft: -13,  
},

 statusText: {
  color: "#16a34a",
  fontWeight: "700",
  fontSize: 12,
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
  alignItems: "center",
  backgroundColor: "#f8fafc",
  borderRadius: 18,
  padding: 10,
  marginRight: 14,
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