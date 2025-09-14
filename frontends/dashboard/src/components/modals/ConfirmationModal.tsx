import type React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmationModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void | Promise<void>;
	title?: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: "default" | "destructive" | "warning";
	isLoading?: boolean;
	icon?: React.ReactNode;
	showIcon?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	open,
	onOpenChange,
	onConfirm,
	title = "Are you sure?",
	description = "This action cannot be undone.",
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	variant = "default",
	isLoading = false,
	icon,
	showIcon = true,
}) => {
	const handleConfirm = async () => {
		try {
			await onConfirm();
			onOpenChange(false);
		} catch (error) {
			// Error handling should be done in the parent component
			console.error("Confirmation action failed:", error);
		}
	};

	const getVariantStyles = () => {
		switch (variant) {
			case "destructive":
				return {
					buttonClass: "bg-red-600 hover:bg-red-700 text-white",
					iconColor: "text-red-600",
					defaultIcon: <AlertTriangle className="h-6 w-6" />,
				};
			case "warning":
				return {
					buttonClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
					iconColor: "text-yellow-600",
					defaultIcon: <AlertTriangle className="h-6 w-6" />,
				};
			default:
				return {
					buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
					iconColor: "text-blue-600",
					defaultIcon: <AlertTriangle className="h-6 w-6" />,
				};
		}
	};

	const variantStyles = getVariantStyles();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-3">
						{showIcon && (
							<div className={`flex-shrink-0 ${variantStyles.iconColor}`}>
								{icon || variantStyles.defaultIcon}
							</div>
						)}
						<div className="flex-1">
							<DialogTitle className="text-left">{title}</DialogTitle>
						</div>
					</div>
					<DialogDescription className="text-left mt-2">
						{description}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isLoading}
					>
						{cancelLabel}
					</Button>
					<Button
						onClick={handleConfirm}
						disabled={isLoading}
						className={variantStyles.buttonClass}
					>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

// Convenience components for common use cases
export const DeleteConfirmationModal: React.FC<
	Omit<ConfirmationModalProps, "variant" | "title" | "confirmLabel">
> = (props) => (
	<ConfirmationModal
		{...props}
		variant="destructive"
		title="Delete Confirmation"
		confirmLabel="Delete"
	/>
);

export const WarningConfirmationModal: React.FC<
	Omit<ConfirmationModalProps, "variant">
> = (props) => <ConfirmationModal {...props} variant="warning" />;
