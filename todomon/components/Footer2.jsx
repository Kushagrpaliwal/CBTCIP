import Image from "next/image"


const Footer2 = () => {
  return (
    <div className="flex flex-row w-full">
        <div className="flex flex-col ml-[100px]">
            <Image src="/logo.svg" alt="logo" width={250} height={250} />
            <p className="w-[500px] mt-[20px]">"Stay organized and achieve more with our TodoList. Your productivity, simplified. © 2024 TodoList Inc. All rights reserved."</p>
            <p className="mt-[20px] font-light italic mb-[50px]">Designed and created by Kushagra paliwal</p>
        </div>
        <div className="flex flex-col w-full">
            <div className="flex flex-row text-center list-none gap-[100px] text-lg justify-end mr-[50px]">
            <li className="hover:text-green1 cursor-pointer">Home</li>
            <li className="hover:text-green1 cursor-pointer">About</li>
            <li className="hover:text-green1 cursor-pointer">Features</li>
            </div>
            <div className="flex flex-row mt-[35px] gap-8 justify-end mr-[50px]">
           <a href=""><Image src="/facebook.svg" alt="logo" width={45} height={45} /></a>
           <a href=""><Image src="/linkedin.svg" alt="logo" width={45} height={45} /></a>
           <a href=""><Image src="/twitter.svg" alt="logo" width={45} height={45} /></a>
           <a href=""><Image src="/instagram.svg" alt="logo" width={45} height={45} /></a>
           <a href=""><Image src="/youtube.svg" alt="logo" width={45} height={45} /></a>
            </div>
        </div>
    </div>
  )
}

export default Footer2