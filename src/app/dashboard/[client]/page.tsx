"use client";

import { Icons } from "@/components/ui/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
const Page = () => {
  const [mini, setMini] = useState(true);

  const toggleSidebar = () => {
    setMini((prevState) => !prevState);
  };
  return (
    <div>
      <div className="sticky top-0 z-50">
        <div className="border-b">
          <div className="container flex justify-between px-2 sm:px-10 items-center">
            <div className="flex items-center justify-center text-lg">
              <img src="/images.png" className="w-12" alt="Logo" />
              <div className="ml-2">Public relation</div>
            </div>
            <div className="flex items-center">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-0 sm:px-10">
        <div className="flex ">
          <div
            className={`${
              mini ? "w-16" : "w-30"
            } transition-width z-50 h-[calc(100vh-4rem)] sticky top-12 border-x right-20 `}
            onMouseOver={toggleSidebar}
            onMouseOut={toggleSidebar}
          >
            <div className="flex items-center py-2 px-4 text-gray-300 hover:text-white ">
              <div className="material-icons">
                <Icons.Vector />
              </div>
              <span className={`${mini ? "hidden" : "ml-2"} `}>about</span>
            </div>
            <div className="flex items-center py-2 px-4 text-gray-300 hover:text-white">
              <div className="material-icons">
                <Icons.Vector />
              </div>
              <span className={`${mini ? "hidden" : "ml-2"}`}>services</span>
            </div>
            <div className="flex items-center py-2 px-4 text-gray-300 hover:text-white">
              <div className="material-icons">
                <Icons.Vector />
              </div>
              <span className={`${mini ? "hidden" : "ml-2"}`}>clients</span>
            </div>
            <div className="flex items-center py-2 px-4 text-gray-300 hover:text-white">
              <div className="material-icons">
                <Icons.Vector />
              </div>
              <div className={`${mini ? "hidden" : "ml-2"}`}>contact</div>
            </div>
          </div>
          <div className="w-full">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi
            dolorum totam a vitae incidunt. Doloremque voluptates adipisci Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
            obcaecati, officia, laboriosam ipsa dolorum, minima earum optio vero
            maiores aut repudiandae ipsam praesentium totam fugit tempore
            voluptates. Consectetur repellat debitis aliquam earum sit nemo
            aperiam voluptatum quos quas unde, voluptatibus asperiores
            aspernatur beatae assumenda dignissimos harum amet reprehenderit
            blanditiis! Facilis incidunt temporibus soluta ratione iure voluptas
            provident sint debitis, porro totam, veniam eaque, sunt dolorem aut
            nobis earum beatae iusto deleniti! Alias enim earum dolorum sequi
            commodi! Possimus numquam cum nam consequuntur, reprehenderit,
            pariatur at alias adipisci atque dolorem facilis recusandae ut ipsum
            quasi ipsam sequi nihil dignissimos laboriosam provident amet
            nostrum animi a quidem. Minus quasi, pariatur eveniet obcaecati
            molestiae velit autem ullam quis. Beatae ipsum deserunt eveniet
            nihil perferendis vero, voluptatem qui reiciendis explicabo
            consequuntur veritatis. Fugit officia ipsum doloremque accusamus
            asperiores aspernatur! Quas cupiditate veritatis quae tempore ut
            autem quo voluptatem ad iure fuga. Ipsum neque adipisci beatae dicta
            vitae velit commodi, voluptates odit eaque laborum natus, quam ex
            quisquam quidem dolore itaque? Recusandae ratione mollitia, minus
            nisi magni molestias labore tenetur qui libero ea, quia repudiandae
            temporibus eaque minima officiis sapiente rerum eius nulla a sequi
            sed repellendus praesentium consectetur. Hic delectus doloremque eum
            repellendus, pariatur quasi iste fugiat, culpa inventore consequatur
            molestias enim velit necessitatibus voluptatem officiis nobis, ea
            doloribus minima ex. Explicabo sunt ex similique quo ipsa
            consequatur tempora et voluptate esse error, voluptatem est amet?
            Quas, corporis veniam. Ex doloribus, consequatur explicabo atque
            distinctio possimus quasi quae iure in nemo! Ea laborum ducimus
            repudiandae. Illum quasi magnam, iure quisquam ipsum officia, aut et
            maxime cupiditate similique ea tempore repudiandae beatae odio
            asperiores in voluptate! Saepe fuga obcaecati, cum nesciunt itaque
            odio aperiam veritatis molestiae officiis alias iure soluta
            distinctio esse dolorum minus provident recusandae qui tempora,
            unde, maxime voluptate vero libero quos? Rem aspernatur impedit hic
            quibusdam possimus nisi deserunt consequuntur vitae provident.
            Ipsum, unde. Magni soluta perspiciatis illum nesciunt? Ipsam ipsa,
            quod aliquam delectus quidem vitae. Nam, impedit! Odit ratione,
            voluptatum cum neque fuga numquam, quae, magni qui doloribus sint
            pariatur voluptatem maxime perspiciatis sapiente. Cum dolor eveniet
            recusandae harum minus vero impedit temporibus magni consequatur
            iusto numquam dolorum voluptatibus omnis natus dolore tempora
            cupiditate accusantium libero molestiae deserunt quasi, quos error.
            Repellendus quo molestiae exercitationem, quisquam nobis, eaque
            dicta quae cumque, dolores hic reiciendis. Nihil libero, est at
            fugiat quibusdam ullam molestiae dolor reiciendis incidunt ratione?
            Numquam, ut voluptas quae voluptatum accusamus veniam provident
            porro suscipit quasi accusantium, nobis consectetur laudantium totam
            recusandae nemo libero. Fugiat blanditiis fugit aliquam
            exercitationem. Magni numquam voluptatibus neque nam cupiditate unde
            quo repellat sint aut quod obcaecati deleniti beatae optio quasi
            eveniet, deserunt temporibus. Incidunt vitae iure at doloribus ipsam
            veritatis excepturi ex. Facilis commodi, et tenetur nemo velit,
            expedita eligendi voluptatem quae est consequatur id repudiandae a.
            Quo saepe sed, dicta cupiditate cum repellendus nostrum quidem nobis
            architecto? Totam velit excepturi aspernatur similique omnis itaque
            beatae non, fugiat facilis quo, veritatis dicta consectetur sapiente
            tempore distinctio facere praesentium labore, error dolore!
            Corporis, dicta sit. Deleniti sit ducimus dolorem sapiente earum aut
            vitae dolores placeat tempora enim iusto debitis soluta praesentium
            nemo sed quos molestiae, obcaecati ut laudantium cumque cupiditate
            totam. Corporis itaque, voluptatum rerum, pariatur dolores rem
            obcaecati quo autem nemo nam, earum enim quod sapiente quis aliquid?
            Nostrum error, repellat sequi, commodi ea tempore voluptatum fugiat
            nobis rerum quaerat dignissimos. Error inventore suscipit
            voluptatibus sapiente est, nam alias illum quia ullam rerum corrupti
            nemo doloribus. Consequuntur voluptas sequi labore eligendi facilis,
            non nihil corrupti eveniet tempora rerum necessitatibus expedita
            ullam aliquam natus corporis voluptatibus neque incidunt doloremque
            optio est vero? Placeat blanditiis, saepe in ratione laudantium
            obcaecati porro voluptates, tenetur numquam, vero odio eligendi?
            Consectetur tenetur inventore voluptatum nobis voluptates quod
            suscipit quisquam quos? Cum aspernatur, labore voluptatibus
            laudantium assumenda accusantium. Inventore provident aliquam beatae
            omnis accusantium aut autem laboriosam ad, quidem itaque alias
            optio, modi, exercitationem nisi quibusdam a veritatis dolore rem
            blanditiis sit corrupti consequuntur cum. Id et voluptas suscipit
            iusto consectetur ad ab adipisci quisquam delectus aliquid nihil
            autem eum eos fuga, voluptate debitis tenetur, deleniti mollitia!
            Odit vitae corporis ullam esse voluptas dignissimos atque
            accusantium dolores velit nihil? Accusantium odit quia corrupti
            atque reiciendis, necessitatibus ea eos quas consequatur tempora
            accusamus cumque aperiam distinctio officiis iure eaque quod.
            Laborum vel accusamus sunt, nesciunt architecto explicabo ipsum, qui
            distinctio possimus rerum incidunt? Et sunt exercitationem error
            facilis adipisci perspiciatis magnam aspernatur pariatur consectetur
            hic rerum nesciunt nam repellendus, autem doloremque vero veritatis
            tempora! Reiciendis esse natus reprehenderit incidunt. Minima
            similique incidunt illum, eaque doloribus tempora dignissimos nihil
            ratione vel omnis quasi obcaecati delectus aliquam reprehenderit
            nesciunt maxime laudantium eligendi deserunt quisquam consectetur
            aspernatur, illo sunt. Sed a commodi, recusandae voluptatum
            excepturi laboriosam est quisquam labore! Nostrum suscipit, eveniet
            laboriosam quia hic explicabo veritatis quod officia incidunt,
            nesciunt similique ullam voluptatum aliquam ea molestias tempore
            dolorum facere optio. In quas harum, deleniti dolorum temporibus
            asperiores culpa amet voluptatum id earum quam totam, necessitatibus
            magni vitae assumenda laudantium ratione rem placeat, error porro
            neque? Eius possimus id iste a tempore qui deleniti odit hic. Unde
            sed fugit perferendis harum fuga amet totam adipisci, nemo
            voluptatibus tempore corporis dolorum cumque ea. Amet, fugiat.
            Debitis, similique minus quia amet sit esse iste placeat sint ad
            repellendus nulla inventore natus deleniti dolores sequi adipisci,
            impedit tempore! Id ad consectetur maiores quos possimus cupiditate
            doloremque, repellendus aliquid at consequatur quod nobis laborum
            deleniti vero labore ea dolorem? Commodi omnis nisi veritatis
            exercitationem recusandae, ducimus iste velit quos dolore nesciunt.
            Et voluptatibus a officia sapiente facilis tempore vel iste dolorum
            dolor, obcaecati magnam, blanditiis labore? Doloribus, hic officia
            necessitatibus laudantium a optio reprehenderit incidunt vel laborum
            libero. Molestias eos asperiores architecto, id qui repellendus a
            saepe? Omnis quaerat nobis dolorum voluptas. Dolorem totam ipsum
            distinctio eos minima enim, facilis quia perspiciatis unde inventore
            voluptatum, eveniet mollitia tempore velit provident excepturi
            voluptates rerum dicta magnam. Deserunt sunt iste voluptates dicta
            blanditiis nulla molestias unde pariatur. Officia voluptatem
            doloribus excepturi, ullam mollitia, similique voluptatibus sunt
            necessitatibus debitis natus sequi.
            <h2>Open/Collapse Sidebar on Hover</h2>
            <p>Hover over any part of the sidebar to open it.</p>
            <p>To close the sidebar, move your mouse out of the sidebar.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
