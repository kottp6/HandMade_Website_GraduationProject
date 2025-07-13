import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from 'react';
import { auth, db } from '../../firebase';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function VendorForm() {
  const [formData, setFormData] = useState({
    nationID: '',
    bio: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const navigator = useNavigate();

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    const userDocRef = doc(db, "Users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const vendorData = {
        ...userData,
        bio: formData.bio,
        nationID: formData.nationID,
      };

      await setDoc(doc(db, "Vendors", user.uid), vendorData);
      toast.success("Vendor details saved!");
      navigator("/login");
    } else {
      console.error("User document not found");
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Complete Your Profile
        </h2>

        <div className="space-y-5">
          {/* Nation ID */}
          <div>
            <label htmlFor="nationID" className="block text-sm font-medium text-gray-700 mb-1">
              Nation ID
            </label>
            <input
              type="text"
              id="nationID"
              name="nationID"
              value={formData.nationID}
              onChange={handleChange}
              placeholder="Enter your National ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us something about you..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#A77F73] text-white py-2.5 rounded-md font-medium text-lg transition hover:bg-[#90675F]"
          >
            Submit
          </button>
        </div>

        {/* Preview Section */}
        {(formData.nationID || formData.bio) && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md border">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Preview</h3>
            {formData.nationID && (
              <p className="text-sm text-gray-700"><strong>Nation ID:</strong> {formData.nationID}</p>
            )}
            {formData.bio && (
              <p className="text-sm text-gray-700 mt-2"><strong>Bio:</strong> {formData.bio}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
