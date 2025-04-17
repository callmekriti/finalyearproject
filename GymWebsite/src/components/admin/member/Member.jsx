import React, { useState} from "react";
import { motion } from "framer-motion";
import  SearchButton from "./SearchButton";
import MemberTypeCard from "./MemberTypeCard";
import MembersTable from "./MembersTable";
import AddMember from "./AddMember"


function Member() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [memberToEdit, setMemberToEdit] = useState(null);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const handleEdit = (member) => {
    setMemberToEdit(member);
    open();
  };

  const handleAddMemberClose = () => {
    setMemberToEdit(null);
    close();
  };
  

  return (
    <div className="flex flex-col md:flex-col bg-indigo-50 dark:bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row w-full justify-between mb-4">
        <SearchButton onSearch={setSearch} />

        <div className="mt-5 mb-4">
          {/* <motion.button
            className="bg-indigo-500 text-white px-3 py-1 rounded-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => (modalOpen ? close() : open())}
          >
            Add Member
          </motion.button> */}

          {modalOpen && (
            <AddMember
              modalOpen={modalOpen}
              handleClose={handleAddMemberClose}
              member={memberToEdit}
            />
          )}
        </div>
      </div>

      <MemberTypeCard />
      <MembersTable searchQuery={search} onEdit={handleEdit} />
    </div>
  );
}

export default Member;