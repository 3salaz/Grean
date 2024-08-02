import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthProfile } from "../../context/AuthProfileContext";
import { Form, Radio, Typography, Input, Upload } from "antd";
import { toast } from "react-toastify";
import { UploadOutlined } from '@ant-design/icons';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";
import driverIcon from '../../assets/icons/driver.png';
import userIcon from '../../assets/icons/user.png';
import Button from "../Layout/Button";

const { Title } = Typography;

function CreateProfile({ handleClose }) {
  const { user, updateProfile } = useAuthProfile();
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleAccountTypeChange = (e) => {
    setAccountType(e.target.value);
  };

  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  const handleProfilePicUpload = ({ file }) => {
    setUploading(true);
    const storageRef = ref(storage, `profilePics/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        toast.error("Error uploading profile picture: " + error.message);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setProfilePic(downloadURL);
        toast.success("Profile picture uploaded successfully!");
        setUploading(false);
      }
    );
  };

  const handleExit = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    if (!accountType || !displayName || !profilePic) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await updateProfile(user.uid, { accountType, displayName, profilePic });
      console.log("Profile updated successfully!");
      if (handleClose) handleClose();  // Close the modal after successful update
    } catch (error) {
      toast.error("Error updating profile: " + error.message);
    }
  };

  return (
    <section className="w-full h-full flex flex-col items-center justify-between gap-4">
      <Title level={2}>Set Account Type</Title>
      <Form layout="vertical" className="w-full max-w-md text-center justify-between flex flex-col items-center p-0">
        <Form.Item className="w-full text-center" required>
          <Radio.Group className="flex items-center justify-center gap-2 w-full" onChange={handleAccountTypeChange} value={accountType}>
            <Radio.Button
              className="basis-1/4 h-20 flex flex-col items-center justify-center aspect-square"
              value="Driver"
            >
              <img className="bg-white" src={driverIcon} alt="Driver" />
              <div className="text-sm text-dark-green">Driver</div>
            </Radio.Button>
            <Radio.Button
              className="basis-1/4 h-20 flex flex-col items-center justify-center aspect-square"
              value="User"
            >
              <img src={userIcon} alt="User" />
              <div className="text-sm text-dark-green">User</div>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Display Name" required>
          <Input value={displayName} onChange={handleDisplayNameChange} />
        </Form.Item>
        <Form.Item label="Profile Picture" required>
          <Upload
            name="profilePic"
            listType="picture"
            customRequest={handleProfilePicUpload}
            showUploadList={false}
          >
            <Button loading={uploading} icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          {profilePic && <img src={profilePic} alt="Profile" style={{ width: '100px', marginTop: '10px' }} />}
        </Form.Item>
        <div className="flex gap-2 flex-col">
          <Button variant="primary" size="medium" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="alert" size="medium" onClick={handleExit}>
            Back
          </Button>
        </div>
      </Form>
    </section>
  );
}

export default CreateProfile;

