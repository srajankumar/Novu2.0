"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { jwtDecode } from "jwt-decode";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface JwtPayload {
  id: string;
}

function DatePicker({
  selectedDate,
  onDateChange,
}: {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default function AddDrivers() {
  const [username, setUsername] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [birthdate, setBirthdate] = React.useState<Date | undefined>();
  const [blood, setBlood] = React.useState("");
  const [license, setLicense] = React.useState("");
  const [experience, setExperience] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [busID, setBusID] = React.useState("");
  const [routeID, setRouteID] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [time, setTime] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const getUserOwnerID = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode(token);
        return decodedToken.id;
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    const formattedBirthdate = birthdate ? format(birthdate, "dd-MM-yyyy") : "";

    const userOwnerID = getUserOwnerID();

    try {
      const response = await fetch("http://localhost:3001/admin/add-driver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username,
          phone,
          password,
          birthdate: formattedBirthdate,
          blood,
          license,
          experience: parseInt(experience),
          imageUrl,
          bio,
          busID,
          routeID,
          from,
          to,
          time,
          userOwner: userOwnerID,
        }),
      });

      if (response.ok) {
        toast.success("Driver added successfully");
        setUsername("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setBirthdate(undefined);
        setBlood("");
        setLicense("");
        setExperience("");
        setImageUrl("");
        setBio("");
        setBusID("");
        setRouteID("");
        setFrom("");
        setTo("");
        setTime("");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex justify-center items-center">
      <form
        onSubmit={handleRegister}
        className="flex pt-5 pb-10 flex-col gap-5 w-full"
      >
        <div className="grid md:grid-cols-2 gap-5">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="grid gap-2">
            <Label htmlFor="birthdate">Birthdate</Label>
            <DatePicker selectedDate={birthdate} onDateChange={setBirthdate} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="blood">Blood Group</Label>
            <Input
              id="blood"
              type="text"
              required
              value={blood}
              onChange={(e) => setBlood(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="license">License Number</Label>
          <Input
            id="license"
            type="text"
            required
            value={license}
            onChange={(e) => setLicense(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="experience">Experience (years)</Label>
          <Input
            id="experience"
            type="number"
            required
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="imageUrl">Profile Image URL</Label>
          <Input
            id="imageUrl"
            type="url"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="grid gap-2">
            <Label htmlFor="busID">Bus ID</Label>
            <Input
              id="busID"
              type="text"
              required
              value={busID}
              onChange={(e) => setBusID(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="routeID">Route ID</Label>
            <Input
              id="routeID"
              type="text"
              required
              value={routeID}
              onChange={(e) => setRouteID(e.target.value)}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="grid gap-2">
            <Label htmlFor="from">From</Label>
            <Input
              id="from"
              type="text"
              required
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="text"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="text"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
