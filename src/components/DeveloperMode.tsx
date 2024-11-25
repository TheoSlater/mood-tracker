import { useState } from "react";
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from "@mui/material";

interface DeveloperModeProps {
    onResetData: () => Promise<void>;
    onDeleteData: () => Promise<void>;
}

const DeveloperMode: React.FC<DeveloperModeProps> = ({ onResetData, onDeleteData }) => {
    const [developerMode, setDeveloperMode] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const toggleDeveloperMode = () => {
        setDeveloperMode((prev) => !prev);
    };

    const handleResetData = async () => {
        setLoading(true);
        await onResetData();
        setLoading(false);
    };

    const handleDeleteData = async () => {
        setLoading(true);
        await onDeleteData();
        setLoading(false);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Button variant="contained" onClick={toggleDeveloperMode}>
                Toggle Developer Mode
            </Button>

            {developerMode && (
                <Box sx={{ marginTop: 2 }}>
                    <Button variant="outlined" color="error" onClick={() => setOpenDialog(true)}>
                        Reset or Delete Data
                    </Button>
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>Developer Actions</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Are you sure you want to reset or delete all data? This action is irreversible.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleResetData} color="secondary" disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : "Reset Data"}
                            </Button>
                            <Button onClick={handleDeleteData} color="error" disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : "Delete Data"}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            )}
        </Box>
    );
};

export default DeveloperMode;
