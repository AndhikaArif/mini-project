export default function Unauthorized() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-2">401 Unauthorized</h1>
      <p className="text-gray-500">Please login to continue.</p>
    </div>
  );
}
