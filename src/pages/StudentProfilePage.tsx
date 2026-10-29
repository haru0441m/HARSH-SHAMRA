import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Phone, School, BookOpen, Shield, CheckCircle2, Save } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { user, updateUserProfile, setUserRole, setActiveTab } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [collegeName, setCollegeName] = useState(user.collegeName);
  const [department, setDepartment] = useState(user.department);
  const [rollNumber, setRollNumber] = useState(user.rollNumber);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      collegeName,
      department,
      rollNumber,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Student Profile & Settings</h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage your verified college details, mobile number for token SMS, and campus dietary preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Profile Card */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-stone-200 p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-2xl flex items-center justify-center mx-auto shadow-inner">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">{user.name}</h2>
            <p className="text-xs text-stone-500 font-mono mt-0.5">{user.rollNumber || '2023CSB0441'}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Verified Student Account
            </span>
          </div>

          <div className="pt-4 border-t border-stone-100 text-left text-xs space-y-2 text-stone-600">
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-stone-400 shrink-0" />
              <span className="truncate">{user.collegeName}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-stone-400 shrink-0" />
              <span>{user.department}</span>
            </div>
          </div>

          {/* Quick Role Switcher shortcut */}
          <div className="pt-4 border-t border-stone-100 text-left">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
              Switch Operational Role
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUserRole('staff')}
                className="p-2 rounded-lg border border-stone-200 text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                Canteen Staff
              </button>
              <button
                type="button"
                onClick={() => setUserRole('admin')}
                className="p-2 rounded-lg border border-stone-200 text-stone-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
              >
                Administrator
              </button>
            </div>
          </div>
        </div>

        {/* Right Settings Form */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
          <h3 className="text-sm font-bold text-stone-900">Personal & Academic Information</h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Roll / Student ID</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={e => setRollNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800 font-mono font-medium focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">College Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800 font-mono font-medium focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-600 font-semibold mb-1">College / University</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={e => setCollegeName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-600 font-semibold mb-1">Department & Year</label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </span>
              ) : (
                <span className="text-stone-400">All data saved locally in active session</span>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
