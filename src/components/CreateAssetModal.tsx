"use client";

import {
  useState,
  useActionState,
  useEffect,
  useRef,
  useTransition,
} from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createAsset,
  assignAsset,
  unassignAsset,
  getAssetHistory,
} from "@/app/dashboard/assets-management/actions";
import type {
  Asset,
  User,
  AssetHistory,
} from "@/app/dashboard/assets-management/page";
import { Loader2 } from "lucide-react";

const createInitialState = { error: "", success: "" };
export function CreateAssetModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [state, formAction] = useActionState(createAsset, createInitialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        onClose();
        formRef.current?.reset();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
        </DialogHeader>
        <form action={formAction} ref={formRef} className="space-y-4">
          <Input
            name="asset_tag"
            placeholder="Asset Tag (e.g., COMP-123)"
            required
          />
          <Input name="serial_number" placeholder="Serial Number" />
          <Select name="asset_type" required>
            <SelectTrigger>
              <SelectValue placeholder="Select asset type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Laptop">Laptop</SelectItem>
              <SelectItem value="Phone">Phone</SelectItem>
              <SelectItem value="Monitor">Monitor</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Input name="manufacturer" placeholder="Manufacturer (e.g., Dell)" />
          <Input name="model" placeholder="Model (e.g., XPS 15)" />
          <Input name="purchase_date" type="date" />
          <Input name="warranty_expiry_date" type="date" />
          <DialogFooter>
            <div className="w-full text-center mr-4">
              {state.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
              )}
              {state.success && (
                <p className="text-green-500 text-sm">{state.success}</p>
              )}
            </div>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Asset</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- REFACTORED USER MANAGEMENT COMPONENTS ---
const actionInitialState = { error: "", success: "" };

type UserDetails = User & {
  job_title?: string | null;
  avatar_url?: string | null;
};

// FIX 1: Created a dedicated component for the Unassign action
function UnassignUserForm({
  asset,
  onSuccess,
}: {
  asset: Asset;
  onSuccess: () => void;
}) {
  const [unassignState, unassignAction] = useActionState(
    unassignAsset,
    actionInitialState
  );
  const currentUser = asset.current_user as UserDetails | null;

  useEffect(() => {
    if (unassignState.success) {
      const timer = setTimeout(onSuccess, 1500);
      return () => clearTimeout(timer);
    }
  }, [unassignState.success, onSuccess]);

  return (
    <form action={() => unassignAction(asset.id)}>
      <h3 className="font-semibold mb-2">Currently Assigned To:</h3>
      <div className="flex items-center gap-3">
        <UserAvatar user={currentUser} size="md" />
        <div>
          <p className="font-medium text-lg">{currentUser?.full_name}</p>
          {currentUser?.job_title && (
            <p className="text-sm text-gray-500">{currentUser.job_title}</p>
          )}
        </div>
      </div>
      <Button variant="destructive" type="submit" className="mt-4">
        Unassign Asset
      </Button>
      {unassignState.error && (
        <p className="text-red-500 text-sm mt-2">{unassignState.error}</p>
      )}
      {unassignState.success && (
        <p className="text-green-500 text-sm mt-2">{unassignState.success}</p>
      )}
    </form>
  );
}

// FIX 2: Created a dedicated component for the Assign action
function AssignUserForm({
  assetId,
  users,
  onSuccess,
}: {
  assetId: number;
  users: User[];
  onSuccess: () => void;
}) {
  const [assignState, assignAction] = useActionState(
    assignAsset,
    actionInitialState
  );

  useEffect(() => {
    if (assignState.success) {
      const timer = setTimeout(onSuccess, 1500);
      return () => clearTimeout(timer);
    }
  }, [assignState.success, onSuccess]);

  return (
    <div>
      <h3 className="font-semibold mb-2">Assign to User:</h3>
      <form action={assignAction} className="flex items-center gap-2">
        <input type="hidden" name="asset_id" value={assetId} />
        <Select name="user_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Select a user..." />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => {
              const userDetails = user as UserDetails;
              return (
                <SelectItem key={userDetails.id} value={userDetails.id}>
                  <div className="flex items-center gap-2">
                    <UserAvatar user={userDetails} size="sm" />
                    <div>
                      <p>{userDetails.full_name}</p>
                      {userDetails.job_title && (
                        <p className="text-xs text-gray-400">
                          {userDetails.job_title}
                        </p>
                      )}
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Button type="submit">Assign</Button>
      </form>
      {assignState.error && (
        <p className="text-red-500 text-sm mt-2">{assignState.error}</p>
      )}
      {assignState.success && (
        <p className="text-green-500 text-sm mt-2">{assignState.success}</p>
      )}
    </div>
  );
}

// --- ASSET DETAILS MODAL (Main Component) ---
type HistoryLogFromServer = Omit<AssetHistory, "assigned_at"> & {
  assigned_at: string | null;
};

function UserAvatar({
  user,
  size = "md",
}: {
  user: UserDetails | null;
  size?: "sm" | "md";
}) {
  if (!user) return null;
  const sizeClasses = size === "md" ? "w-10 h-10 text-lg" : "w-6 h-6 text-sm";
  return user.avatar_url ? (
    <Image
      src={user.avatar_url}
      alt={user.full_name || "User Avatar"}
      width={size === "md" ? 40 : 24}
      height={size === "md" ? 40 : 24}
      className="rounded-full object-cover"
    />
  ) : (
    <div
      className={`flex items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold ${sizeClasses}`}
    >
      {user.full_name?.charAt(0).toUpperCase()}
    </div>
  );
}

export function AssetDetailsModal({
  asset,
  users,
  onClose,
}: {
  asset: Asset | null;
  users: User[];
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState("details");
  const [history, setHistory] = useState<AssetHistory[]>([]);
  const [isHistoryLoading, startHistoryTransition] = useTransition();

  useEffect(() => {
    if (asset) {
      setActiveTab("details"); // Reset to the default tab when a new asset is opened
      setHistory([]);
    }
  }, [asset]);

  useEffect(() => {
    if (asset && activeTab === "history") {
      startHistoryTransition(async () => {
        const historyData: HistoryLogFromServer[] = await getAssetHistory(
          asset.id
        );
        const validHistory = historyData.filter(
          (log): log is AssetHistory => log.assigned_at !== null
        );
        setHistory(validHistory);
      });
    }
  }, [asset, activeTab]);

  if (!asset) return null;

  return (
    <Dialog open={!!asset} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Asset Details: {asset.asset_tag}</DialogTitle>
          <DialogDescription>
            {asset.manufacturer} {asset.model}
          </DialogDescription>
        </DialogHeader>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 ${
              activeTab === "details"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("user")}
            className={`px-4 py-2 ${
              activeTab === "user"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 ${
              activeTab === "history"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            History
          </button>
        </div>

        <div className="py-4 min-h-[200px]">
          {activeTab === "user" &&
            // FIX 3: Render the appropriate form component with a unique key
            (asset.current_user ? (
              <UnassignUserForm
                key={asset.id}
                asset={asset}
                onSuccess={onClose}
              />
            ) : (
              <AssignUserForm
                key={asset.id}
                assetId={asset.id}
                users={users}
                onSuccess={onClose}
              />
            ))}

          {activeTab === "details" && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              {" "}
              <div>
                <strong className="block text-gray-500">Asset Tag</strong>
                {asset.asset_tag}
              </div>{" "}
              <div>
                <strong className="block text-gray-500">Asset Type</strong>
                {asset.asset_type}
              </div>{" "}
              <div>
                <strong className="block text-gray-500">Serial No.</strong>
                {asset.serial_number ?? "N/A"}
              </div>{" "}
              <div>
                <strong className="block text-gray-500">Manufacturer</strong>
                {asset.manufacturer ?? "N/A"}
              </div>{" "}
              <div>
                <strong className="block text-gray-500">Model</strong>
                {asset.model ?? "N/A"}
              </div>{" "}
              <div>
                <strong className="block text-gray-500">Purchase Date</strong>
                {asset.purchase_date
                  ? new Date(asset.purchase_date).toLocaleDateString()
                  : "N/A"}
              </div>{" "}
              <div>
                <strong className="block text-gray-500">Warranty Expiry</strong>
                {asset.warranty_expiry_date
                  ? new Date(asset.warranty_expiry_date).toLocaleDateString()
                  : "N/A"}
              </div>{" "}
            </div>
          )}
          {activeTab === "history" && (
            <div>
              {" "}
              {isHistoryLoading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin h-6 w-6" />
                </div>
              ) : (
                <ul className="space-y-2">
                  {" "}
                  {history.length > 0 ? (
                    history.map((log) => (
                      <li key={log.id} className="text-sm border-b pb-2">
                        {" "}
                        Assigned to{" "}
                        <strong>{log.user?.full_name ?? "N/A"}</strong> on{" "}
                        {new Date(log.assigned_at).toLocaleString()}{" "}
                        {log.unassigned_at &&
                          ` and unassigned on ${new Date(
                            log.unassigned_at
                          ).toLocaleString()}`}{" "}
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No assignment history for this asset.
                    </p>
                  )}{" "}
                </ul>
              )}{" "}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
