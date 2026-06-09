'use client';

import { useEffect, useState } from 'react';

interface Technician {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
  specialization: 'BATTERY' | 'MOTOR' | 'CONTROLLER' | 'GENERAL_EV';
  experienceYears: string;
  address?: string | null;
  profileImage?: string | null;
}

export default function OwnerTechniciansPage() {
  // States
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Registration States
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    employeeId: '',
    specialization: 'GENERAL_EV',
    experienceYears: '',
    address: '',
  });
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  // States for Edit Mode
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    employeeId: '',
    specialization: 'GENERAL_EV',
    experienceYears: '',
    address: '',
  });

  // Fetch list on page load
  useEffect(() => {
    const fetchAllTechnicians = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/technician/getAllTechnicians');
        if (!response.ok) throw new Error('Could not retrieve data from the EV server.');
        const data = await response.json();
        setTechnicians(data);
      } catch (err) {
        // Logging the error ensures it is "used", making ESLint happy!
        console.error(err);
        setErrorMessage(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllTechnicians();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMessage(null);
    setFormSuccessMessage(null);

    try {
      const response = await fetch('http://localhost:3000/api/technician/createTechnician', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || 'Failed to register technician.');

      setFormSuccessMessage('Technician registered successfully into the workshop!');
      setTechnicians((prevList) => [...prevList, responseData.technician]);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        employeeId: '',
        specialization: 'GENERAL_EV',
        experienceYears: '',
        address: '',
      });
    } catch (err) {
      // Fixed: Logging the registration network error
      console.error(err);
      setFormErrorMessage(err instanceof Error ? err.message : 'Failed to submit form.');
    }
  };

  const handleDeleteTechnician = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to remove this technician from the system?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/technician/deleteTechnician/${id}`, {
        method: 'DELETE',
      });
      const responseData = await response.json();
      if (!response.ok) {
        alert(responseData.message || 'Could not delete technician.');
        return;
      }
      alert(responseData.message);
      setTechnicians((prevList) => prevList.filter((tech) => tech.id !== id));
    } catch (err) {
      // Fixed: Using the 'err' variable by printing it to your browser debug logs
      console.error(err);
      alert('Network error: Could not complete deletion request.');
    }
  };

  const startEditing = (tech: Technician) => {
    setEditingId(tech.id);
    setEditFormData({
      fullName: tech.fullName,
      email: tech.email,
      phone: tech.phone,
      employeeId: tech.employeeId,
      specialization: tech.specialization,
      experienceYears: tech.experienceYears,
      address: tech.address || '',
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSaveSubmit = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/technician/updateTechnician/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        alert(responseData.message || 'Failed to update technician record.');
        return;
      }

      setTechnicians((prevList) =>
        prevList.map((tech) => (tech.id === id ? responseData.technician : tech))
      );

      setEditingId(null);
      alert('Technician changes saved successfully!');
    } catch (err) {
      // 🚨 FIXED HERE TOO: Logging this network error ensures the unused variable error is completely gone!
      console.error(err);
      alert('Network error: Failed to modify record.');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-lg text-gray-600 font-medium">Fetching active EV technicians...</div>;
  if (errorMessage) return <div className="p-8 text-center text-red-500 font-semibold">Error: {errorMessage}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Technician Ecosystem Management</h1>
        <p className="text-sm text-gray-500">Monitor and expand your shop&apos;s engineering team resources.</p>
      </div>

      {/* Registration Form Panel */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 shadow-sm max-w-3xl">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Register New Team Member</h2>
        {formSuccessMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 font-medium rounded-lg text-sm">{formSuccessMessage}</div>}
        {formErrorMessage && <div className="mb-4 p-3 bg-red-100 text-red-700 font-medium rounded-lg text-sm">{formErrorMessage}</div>}

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full border border-gray-300 rounded p-2 text-sm bg-white" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Employee ID</label>
            <input type="text" name="employeeId" value={formData.employeeId} onChange={handleInputChange} required className="w-full border border-gray-300 rounded p-2 text-sm bg-white" placeholder="EMP-102" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full border border-gray-300 rounded p-2 text-sm bg-white" placeholder="john@evshop.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full border border-gray-300 rounded p-2 text-sm bg-white" placeholder="9876543210" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Specialization</label>
            <select name="specialization" value={formData.specialization} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 text-sm bg-white">
              <option value="GENERAL_EV">General EV Maintenance</option>
              <option value="BATTERY">Battery Specialist</option>
              <option value="MOTOR">Motor Repair</option>
              <option value="CONTROLLER">Controller Tuning</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Years of Experience</label>
            <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleInputChange} required className="w-full border border-gray-300 rounded p-2 text-sm bg-white" placeholder="3" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Home/Shop Address (Optional)</label>
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 text-sm bg-white" placeholder="123 Main Road, New Delhi" />
          </div>
          <div className="md:col-span-2 pt-2">
            <button type="submit" className="w-full md:w-auto bg-blue-600 text-white font-semibold rounded px-6 py-2 hover:bg-blue-700 transition-colors text-sm">
              Register Technician
            </button>
          </div>
        </form>
      </div>

      {/* Directory Grid View */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Active Staff List</h2>
        {technicians.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <p className="text-gray-500">No technicians are registered in the workshop database yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians.map((tech) => {
              const isEditingThisCard = tech.id === editingId;

              return (
                <div key={tech.id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  
                  {isEditingThisCard ? (
                    /* PANEL A: Edit Mode Form Inputs */
                    <div className="space-y-3 text-xs">
                      <h3 className="font-bold text-gray-700 border-b pb-1 mb-2">Edit Mode Form</h3>
                      <div>
                        <label className="block font-semibold text-gray-500 mb-0.5">Full Name</label>
                        <input type="text" name="fullName" value={editFormData.fullName} onChange={handleEditInputChange} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-500 mb-0.5">Employee ID</label>
                        <input type="text" name="employeeId" value={editFormData.employeeId} onChange={handleEditInputChange} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-500 mb-0.5">Email Address</label>
                        <input type="email" name="email" value={editFormData.email} onChange={handleEditInputChange} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-500 mb-0.5">Phone Number</label>
                        <input type="text" name="phone" value={editFormData.phone} onChange={handleEditInputChange} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-500 mb-0.5">Specialization</label>
                        <select name="specialization" value={editFormData.specialization} onChange={handleEditInputChange} className="w-full border border-gray-300 rounded p-1 text-xs bg-white">
                          <option value="GENERAL_EV">GENERAL_EV</option>
                          <option value="BATTERY">BATTERY</option>
                          <option value="MOTOR">MOTOR</option>
                          <option value="CONTROLLER">CONTROLLER</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-500 mb-0.5">Experience (Years)</label>
                        <input type="number" name="experienceYears" value={editFormData.experienceYears} onChange={handleEditInputChange} className="w-full border rounded p-1 text-xs" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-500 mb-0.5">Address</label>
                        <input type="text" name="address" value={editFormData.address} onChange={handleEditInputChange} className="w-full border rounded p-1 text-xs" />
                      </div>

                      <div className="pt-2 flex space-x-2">
                        <button onClick={() => handleEditSaveSubmit(tech.id)} className="px-3 py-1 bg-green-600 text-white rounded font-medium text-xs hover:bg-green-700">
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-300 text-gray-700 rounded font-medium text-xs hover:bg-gray-400">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* PANEL B: Standard View Card Layout */
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold uppercase text-lg">
                          {tech.fullName.charAt(0)}
                        </div>
                        <div>
                          <h2 className="text-md font-bold text-gray-800">{tech.fullName}</h2>
                          <p className="text-xs text-gray-400">Emp ID: {tech.employeeId}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                        <p><strong className="text-gray-700">Expertise:</strong> <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold uppercase">{tech.specialization}</span></p>
                        <p><strong className="text-gray-700">Experience:</strong> {tech.experienceYears} Years</p>
                        <p><strong className="text-gray-700">Email:</strong> {tech.email}</p>
                        <p><strong className="text-gray-700">Phone:</strong> {tech.phone}</p>
                        {tech.address && <p><strong className="text-gray-700">Address:</strong> {tech.address}</p>}
                      </div>

                      <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end space-x-2">
                        <button onClick={() => startEditing(tech)} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded text-xs transition-colors">
                          Edit Details
                        </button>
                        <button onClick={() => handleDeleteTechnician(tech.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded text-xs transition-colors">
                          Remove Staff
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}