import { useState } from "react";
import { useRouter } from "next/navigation";

const BusinessInfoForm = () => {
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      business_name: businessName,
      description: description,
      category: category,
      address: address,
    };

    try {
      const response = await fetch("/api/saveUserInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result); // Handle the result or response as needed
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="businessName">Business Name:</label>
        <input
          type="text"
          className="form-control mb-2 mr-sm-2 mb-sm-0 w-1/2 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-base border border-gray-400 shadow-none outline-none focus:outline-none focus:ring"
          id="businessName"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          className="form-control mb-2 mr-sm-2 mb-sm-0 w-1/2 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-base border border-gray-400 shadow-none outline-none focus:outline-none focus:ring"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          className="form-control mb-2 mr-sm-2 mb-sm-0 w-1/2 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-base border border-gray-400 shadow-none outline-none focus:outline-none focus:ring"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          className="form-control mb-2 mr-sm-2 mb-sm-0 w-1/2 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-base border border-gray-400 shadow-none outline-none focus:outline-none focus:ring"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="ml-4 text-teal-500 hover:text-teal-600 bg-black hover:bg-gray-100 border border-teal-500 hover:border-teal-600 rounded-lg px-4 py-2 text-sm font-medium text-white hover:text-gray"
      >
        Submit
      </button>
    </form>
  );
};

export default BusinessInfoForm;
