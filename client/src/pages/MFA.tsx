import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Shield, Smartphone, Key, CheckCircle2, XCircle, Copy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function MFA() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  
  // Simulated QR code and secret
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/MelitechCRM:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MelitechCRM";
  const secret = "JBSWY3DPEHPK3PXP";

  const handleEnableMFA = () => {
    setShowSetup(true);
    // Generate backup codes
    const codes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );
    setBackupCodes(codes);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setMfaEnabled(true);
      setShowSetup(false);
      toast.success("Two-factor authentication enabled successfully!");
    }, 1000);
  };

  const handleDisableMFA = () => {
    setMfaEnabled(false);
    setShowSetup(false);
    toast.success("Two-factor authentication disabled");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "melitech-crm-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup codes downloaded!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Two-Factor Authentication</h1>
          <p className="text-muted-foreground">
            Add an extra layer of security to your account
          </p>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authentication Status
                </CardTitle>
                <CardDescription>Current two-factor authentication status</CardDescription>
              </div>
              <Badge variant={mfaEnabled ? "default" : "secondary"} className="text-sm">
                {mfaEnabled ? (
                  <>
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Enabled
                  </>
                ) : (
                  <>
                    <XCircle className="mr-1 h-3 w-3" />
                    Disabled
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {mfaEnabled ? (
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle>Two-factor authentication is enabled</AlertTitle>
                <AlertDescription>
                  Your account is protected with an additional layer of security. You'll need to enter a code from your authenticator app when signing in.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <XCircle className="h-4 w-4 text-yellow-500" />
                <AlertTitle>Two-factor authentication is not enabled</AlertTitle>
                <AlertDescription>
                  Protect your account by enabling two-factor authentication. This adds an extra layer of security by requiring a code from your phone in addition to your password.
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-4 flex gap-4">
              {!mfaEnabled && !showSetup && (
                <Button onClick={handleEnableMFA}>
                  <Shield className="mr-2 h-4 w-4" />
                  Enable Two-Factor Authentication
                </Button>
              )}
              {mfaEnabled && (
                <Button variant="destructive" onClick={handleDisableMFA}>
                  Disable Two-Factor Authentication
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Setup Process */}
        {showSetup && !mfaEnabled && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Step 1: Scan QR Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Step 1: Scan QR Code
                </CardTitle>
                <CardDescription>Use your authenticator app to scan this QR code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                </div>
                
                <div className="space-y-2">
                  <Label>Or enter this code manually:</Label>
                  <div className="flex gap-2">
                    <Input value={secret} readOnly className="font-mono" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(secret)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Alert>
                  <Smartphone className="h-4 w-4" />
                  <AlertDescription>
                    Download an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator from your app store.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Step 2: Verify Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Step 2: Verify Code
                </CardTitle>
                <CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <Input
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      className="text-center text-2xl tracking-widest font-mono"
                      maxLength={6}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={isVerifying || verificationCode.length !== 6} className="w-full">
                    {isVerifying ? "Verifying..." : "Verify and Enable"}
                  </Button>
                </form>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h4 className="font-medium">Backup Codes</h4>
                  <p className="text-sm text-muted-foreground">
                    Save these backup codes in a safe place. You can use them to access your account if you lose your phone.
                  </p>
                  <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg font-mono text-sm">
                    {backupCodes.slice(0, 6).map((code, index) => (
                      <div key={index}>{code}</div>
                    ))}
                  </div>
                  <Button variant="outline" onClick={downloadBackupCodes} className="w-full">
                    Download Backup Codes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>How Two-Factor Authentication Works</CardTitle>
            <CardDescription>Understanding the security benefits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <h4 className="font-medium">Enter Password</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sign in with your username and password as usual
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <h4 className="font-medium">Get Code</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Open your authenticator app to get a 6-digit code
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <h4 className="font-medium">Verify</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the code to complete your sign in
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium">Why Enable Two-Factor Authentication?</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Protects your account even if your password is compromised</li>
                <li>• Prevents unauthorized access to sensitive business data</li>
                <li>• Meets security compliance requirements</li>
                <li>• Provides peace of mind with enhanced security</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

