export default function Forbidden() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-2">403 Forbidden</h1>
      <p className="text-gray-500">
        You are not authorized to access this page.
      </p>
    </div>
  );
}
