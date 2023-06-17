import Layout from "@/components/Layout";
import { Alert, Button, Chip, TextField } from "@mui/material";
import { Face } from "@mui/icons-material";
import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteDialog from "@/components/DeleteDialog";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [adminEmails, setAdminEmails] = useState([]);
  const [deleteAdminId, setDeleteAdminId] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [error, setError] = useState(null);

  function handleAdminEmailSave() {
    axios
      .post("/api/admin", { email })
      .then((res) => {
        setEmail("");
        fetchAdminEmail();
      })
      .catch((err) => {
        setError(err.response.data.message);
        setTimeout(() => {
          setError(null);
        }, 2000);
      });
  }

  function fetchAdminEmail() {
    axios.get("/api/admin").then((res) => {
      setAdminEmails(res.data);
    });
  }

  function handleChipOnDelete(id) {
    setDeleteConfirmationOpen(true);
    setDeleteAdminId(id);
  }

  function handleDeleteAdmin() {
    axios.delete("/api/admin?_id=" + deleteAdminId).then(() => {
      setDeleteAdminId("");
    });
    setDeleteConfirmationOpen(false);
    fetchAdminEmail();
  }

  useEffect(() => {
    fetchAdminEmail();
  }, []);

  return (
    <Layout>
      {error && <Alert severity="error">{error}</Alert>}
      <div className={"flex justify-center"}>
        <div className={"flex flex-col max-w-lg"}>
          <h1>Admin</h1>
          <h2>Add new admin</h2>
          <div className={"flex gap-2"}>
            <TextField
              placeholder={"new admin email"}
              sx={{ width: "50ch" }}
              value={email}
              size={"small"}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button variant="contained" onClick={handleAdminEmailSave}>
              Save
            </Button>
          </div>
          <div className={"mt-1"}>
            <h2>Existing Admin</h2>
            <div className={"flex flex-wrap gap-2"}>
              {adminEmails.length > 0 &&
                adminEmails.map((adminEmail) => (
                  <Chip
                    key={adminEmail._id}
                    icon={<Face />}
                    label={adminEmail.email}
                    variant="outlined"
                    onDelete={() => handleChipOnDelete(adminEmail._id)}
                  />
                ))}
            </div>
          </div>
          <DeleteDialog
            type="admin"
            open={deleteConfirmationOpen}
            onClose={() => setDeleteConfirmationOpen(false)}
            onConfirm={handleDeleteAdmin}
          />
        </div>
      </div>
    </Layout>
  );
}
