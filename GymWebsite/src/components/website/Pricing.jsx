import { useEffect, useState } from "react";
import KhaltiCheckout from "khalti-checkout-web";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PricingCard = ({ title, price, features, bgClass, priceNote }) => {
  const [showPopup, setShowPopup] = useState(false); 
  const [transactionId, setTransactionId] = useState("");
  const [membership,setMembership]=useState("");

  // Function to generate a random transaction ID
  const generateTransactionId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Handle Khalti Payment
  const handleKhaltiPayment = (amount,title) => {
    const totalAmount = amount * 100;

    let checkout = new KhaltiCheckout({
      publicKey: "test_public_key_617c4c6fe77c441d88451ec1408a0c0e",
      productIdentity: "1234567890",
      productName: title,
      productUrl: "http://localhost:3000",
      eventHandler: {
        onSuccess(payload) {
          console.log("Payment Successful:", payload);

          let data = {
            token: payload.token,
            amount: totalAmount,
          };

          let config = {
            headers: {
              Authorization: "test_secret_key_3f78fb6364ef4bd1b5fc670ce33a06f5",
            },
          };

          axios
            .post("/khalti-api/payment/verify/", data, config)
            .then((response) => {
              console.log("Verification Response:", response.data);
              const newTransactionId = generateTransactionId();
              setTransactionId(newTransactionId);
              setMembership(title)
              setShowPopup(true);
            })
            .catch((error) => {
              console.error("Payment Verification Error:", error);
            });
        },
        onError(error) {
          console.error("Khalti Payment Error:", error);
        },
        onClose() {
          console.log("Khalti Checkout Closed");
        },
      },
      paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
    });

    checkout.show({ amount: totalAmount });
  };

  return (
    <div className="w-[300px] m-6 bg-white text-black rounded-xl shadow-2xl mb-4">
      <div className="bg-purple-100 p-4 rounded-xl">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">Best for {title.toLowerCase()} projects</p>
        <div className="mt-6">
          <span className="text-4xl font-bold">RS.{price}</span>
          <span className="text-lg font-medium">/Month</span>
        </div>
        <p className="text-sm text-gray-500 mt-1 mb-6">{priceNote}</p>
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-purple-500 text-white"
          onClick={() => handleKhaltiPayment(price,title)}
        >
          Buy Now
        </button>
      </div>
      <div className="bg-white p-4 rounded-2xl">
        <ul className="list-none space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="material-icons text-green-400">check_circle</span>
              <span className="ml-2">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

    
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold">Payment Successful</h2>
            <p className="mt-2">
              Your transaction ID is: <span className="font-bold">{transactionId}</span>
            </p>
            <p className="mt-2">
              Your Membership Type is: <span className="font-bold">{membership}</span>
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Pricing = () => {
  const plans = [
    {
      title: "Basic Membership",
      price: 100,
      priceNote: "Rs.100/month",
      bgClass: "bg-blue-500",
      features: [
        "Access to basic gym equipment",
        "Personal locker",
        "Basic fitness classes",
        "General gym support",
        "Limited hours access",
      ],
    },
    {
      title: "Standard Membership",
      price: 150,
      priceNote: "Rs.150/month",
      bgClass: "bg-green-500",
      features: [
        "Access to full gym equipment",
        "Personal locker",
        "Advanced fitness classes",
        "Personal trainer sessions (limited)",
        "Extended hours access",
      ],
    },
    {
      title: "Premium Membership",
      price: 200,
      priceNote: "Rs.200/month",
      bgClass: "bg-red-500",
      features: [
        "Access to full gym equipment",
        "Priority locker",
        "Unlimited fitness classes",
        "Personal trainer sessions (unlimited)",
        "24/7 gym access",
      ],
    },
  ];

  return (
    <div className="p-8 flex justify-center items-center">
      <div className="flex flex-col lg:flex-row lg:gap-x-16">
        {plans.map((plan, index) => (
          <div key={index} className="w-full md:w-1/3 px-2 mb-4">
            <PricingCard {...plan} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
