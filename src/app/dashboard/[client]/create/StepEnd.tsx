"use client"

interface StepEndProps {
    onPrevious: () => void;

  }

const StepEnd: React.FC<StepEndProps> = ({ onPrevious }) => {
  return (
    <div>Stepthree</div>
  )
}

export default StepEnd