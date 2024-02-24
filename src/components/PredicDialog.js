import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider } from "@mui/material";

export default function PredicDialog({ open, handleClose, currData }) {
  const [data] = React.useState(currData.duplex);
  const [duplex, setDuplex] = React.useState("");

  React.useEffect(() => {
    if (data && data[0]) {
      const duplex_structure = `
<pre>
mRNA  3’   ${data[0][0]}   5’
          ${data[0][1]}   
          ${data[0][2]}   
miRNA  5’  ${data[0][3]}  3’
</pre>
      `;
      setDuplex(duplex_structure);
    }
  }, [data]);

  return (
    <div style={{ height: "80vh" }}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ backgroundColor: "#EDE4ED", color: "#8A39AD" }}
        >
          {"Prediction information"}
        </DialogTitle>
        <DialogContent style={{ backgroundColor: "#F8F8FF" }}>
          <DialogContentText id="alert-dialog-description">
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              <span style={{ color: '#8A39AD' }}>Duplex:{" "}</span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: 'center',
                  marginLeft: "10px",
                }}
                dangerouslySetInnerHTML={{ __html: duplex }}
              >
              </div>
            </div>
            <Divider />
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <span style={{color:'#8A39AD'}}>Start: </span>{data && data[0] && data[0][4]}
            </div>
            <Divider />
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <span style={{color:'#8A39AD'}}>End: </span>{data && data[0] && data[0][5]}
            </div>
            <Divider />
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <span style={{color:'#8A39AD'}}>Energy MEF duplex: </span>{data && data[0] && data[0][6]}
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ backgroundColor: "#F8F8FF" }}>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
