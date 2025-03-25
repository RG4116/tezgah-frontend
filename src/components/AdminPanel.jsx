import CountertopForm from "./CountertopForm";
import CountertopList from "./CountertopList";

export default function AdminPanel() {
  return (
    <div className="space-y-6">
      <CountertopForm />
      <CountertopList />
    </div>
  )
}
