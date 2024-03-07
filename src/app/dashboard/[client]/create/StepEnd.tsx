"use client"

interface StepEndProps {
    onPrevious: () => void;
    formData: {
      firstName: string;
      lastName: string;
      email: string;
    };
  }

const StepEnd: React.FC<StepEndProps> = ({ onPrevious, formData }) => {
  return (
    <div>Stepthree</div>
  )
}

export default StepEnd