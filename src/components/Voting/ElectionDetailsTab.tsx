import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Election } from '@/lib/types'

interface ElectionDetailsTabProps {
  election: Election
  onSave: (updatedElection: Election) => void
}

export default function ElectionDetailsTab({ election, onSave }: ElectionDetailsTabProps) {
  const [electionData, setElectionData] = useState(election)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setElectionData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined, field: 'startDate' | 'endDate') => {
    if (date) {
      setElectionData(prev => ({ ...prev, [field]: date }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Election Details</CardTitle>
        <CardDescription>Edit the details of your election</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(electionData); }}>
          <div>
            <Label htmlFor="title">Election Title</Label>
            <Input id="title" name="title" value={electionData.title} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={electionData.description} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Badge variant={electionData.status === "Active" ? "default" : electionData.status === "Upcoming" ? "secondary" : "outline"}>
              {electionData.status}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DatePickerField
              label="Start Date"
              date={electionData.startDate}
              onSelect={(date) => handleDateChange(date, 'startDate')}
            />
            <DatePickerField
              label="End Date"
              date={electionData.endDate}
              onSelect={(date) => handleDateChange(date, 'endDate')}
            />
          </div>
          <div>
            <Label>Total Voters</Label>
            <p>{electionData.voters}</p>
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  )
}

interface DatePickerFieldProps {
  label: string
  date: Date
  onSelect: (date: Date | undefined) => void
}

function DatePickerField({ label, date, onSelect }: DatePickerFieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}