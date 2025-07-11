import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const DebugBlock: React.FC = () => {
  const inviteLink = useSelector((state: RootState) => state.channel.inviteLink);
  const botLink = useSelector((state: RootState) => state.channel.botLink);
  const isLoading = useSelector((state: RootState) => state.channel.isLoading);
  const balance = useSelector((state: RootState) => state.balance.value);
  const isRegistered = useSelector((state: RootState) => state.app.isRegistered);

  return (
    <div style={{
      position: "fixed",
      left: 10,
      bottom: 10,
      zIndex: 99999,
      background: "#fff",
      color: "#111",
      border: "1px solid #ccc",
      borderRadius: 8,
      padding: 12,
      fontSize: 12,
      maxWidth: 400,
      wordBreak: "break-all",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <b>DEBUG INFO</b>
      <div><b>inviteLink:</b> {inviteLink || <span style={{color: "red"}}>EMPTY</span>}</div>
      <div><b>botLink:</b> {botLink || <span style={{color: "red"}}>EMPTY</span>}</div>
      <div><b>isLoading:</b> {isLoading ? "true" : "false"}</div>
      <div><b>balance:</b> {balance}</div>
      <div><b>isRegistered:</b> {isRegistered ? "true" : "false"}</div>
    </div>
  );
};

export default DebugBlock; 