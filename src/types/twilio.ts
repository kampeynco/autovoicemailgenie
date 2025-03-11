
export interface PhoneNumber {
  id: string;
  user_id: string;
  phone_number: string;
  twilio_sid: string;
  friendly_name?: string;
  status: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Call {
  id: string;
  user_id: string;
  phone_number_id: string;
  caller_number: string;
  call_sid: string;
  status: string;
  duration?: number;
  has_recording: boolean;
  is_heard?: boolean;  // Add the is_heard property as optional
  call_time: string;
  created_at: string;
  updated_at: string;
}

export interface CallRecording {
  id: string;
  call_id: string;
  recording_sid: string;
  recording_url: string;
  duration?: number;
  file_path?: string;
  transcription?: string;
  created_at: string;
  updated_at: string;
}

export interface CallWithRecording extends Call {
  recording?: CallRecording;
}
