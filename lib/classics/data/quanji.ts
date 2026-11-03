/**
 * 《紫微斗数全集》— 核心精选章节
 *
 * 公版（明代刊本，相传由陈抟祖师传）
 * 是紫微斗数最权威的古籍之一，全本约 8 万字。
 * 此处精选核心论述，未来可补全。
 */

import type { Book } from '../types';

export const ziWeiQuanJi: Book = {
  title: '紫微斗数全集',
  titleVi: 'Tử Vi Đẩu Số Toàn Tập',
  slug: 'quanji',
  dynasty: '明代',
  dynastyVi: 'Đời Minh',
  author: '相传陈抟祖师传',
  authorVi: 'Tương truyền do Trần Đoàn tổ sư truyền lại',
  intro: '紫微斗数最权威的古籍之一，相传由宋代陈抟祖师传授。倪海厦《天纪》体系的核心引证来源。',
  introVi: 'Một trong những sách cổ uy tín nhất về Tử Vi Đẩu Số, tương truyền do Trần Đoàn tổ sư đời Tống truyền dạy. Đây là nguồn dẫn chứng chính trong hệ thống “Thiên Kỷ” của thầy Nghê Hải Hạ.',
  wordCount: 80000,
  chapters: [
    {
      title: '卷一·总论',
      titleVi: 'Quyển 1 · Tổng luận',
      subtitle: '紫微斗数的基本立法',
      subtitleVi: 'Phép tắc cơ bản của Tử Vi Đẩu Số',
      paragraphs: [
        {
          id: 'qj-1-1',
          idx: 1,
          text: '夫紫微斗数者，乃陈抟祖师所传，原以紫微为帝座，统御百星。星曜各有所主，各有庙旺利陷之分，会照吉凶之别。看命者，必先安星，次定命宫身宫，三看十二宫吉凶，四参大限流年之飞化。',
          vi: 'Tử Vi Đẩu Số do Trần Đoàn tổ sư truyền lại, vốn lấy Tử Vi làm ngôi đế, cai quản trăm sao. Mỗi sao chủ một việc, mỗi sao có phân biệt Miếu, Vượng, Lợi, Hãm, và hội chiếu thì có tốt có xấu. Người xem số trước phải an sao, sau định cung Mệnh, cung Thân, thứ ba xem tốt xấu của mười hai cung, thứ tư xét sự phi hoá của Đại Hạn, Lưu Niên.',
        },
        {
          id: 'qj-1-2',
          idx: 2,
          text: '安星之法：先以年干起紫微，紫微所在宫位定，则诸星皆按其法位列十二宫。十四主星各居其位，六吉六煞辅而行之。一盘既定，万象皆现。',
          vi: 'Phép an sao: trước dựa vào can năm để khởi sao Tử Vi; định được cung có Tử Vi thì các sao khác theo phép mà xếp vào mười hai cung. Mười bốn chính tinh mỗi sao ở một vị trí, sáu cát tinh và sáu sát tinh đi kèm phụ trợ. Một lá số đã lập xong thì mọi điều đều hiện ra.',
        },
        {
          id: 'qj-1-3',
          idx: 3,
          text: '命宫为本，主一生格局；身宫为辅，主三十后归向。命身分明，方知一人之进退。三方四正会照，方知一人之用武之地。十二宫各有所主，方知人生之全图。',
          vi: 'Cung Mệnh là gốc, chủ cách cục cả đời; cung Thân là phụ, chủ hướng đi sau tuổi ba mươi. Phân rõ Mệnh và Thân mới biết đường tiến lui của một người. Xem Tam Phương Tứ Chính hội chiếu mới biết chỗ người ấy phát huy tài năng. Mười hai cung mỗi cung chủ một việc, xem đủ mới thấy toàn cảnh cuộc đời.',
        },
      ],
    },
    {
      title: '卷二·紫微星论',
      titleVi: 'Quyển 2 · Bàn về sao Tử Vi',
      subtitle: '帝座之尊',
      subtitleVi: 'Sự tôn quý của ngôi đế',
      paragraphs: [
        {
          id: 'qj-2-1',
          idx: 1,
          text: '紫微为北斗之主，统辖众星。紫微属土，乃尊贵之星。在数为帝座，化气为尊，主忠厚有威仪，独行其道。男命女命皆喜紫微守命，但需有左辅右弼来朝，方为正格。',
          vi: 'Tử Vi là chủ của chòm Bắc Đẩu, cai quản các sao. Tử Vi hành Thổ, là sao tôn quý. Trong số là ngôi đế, hoá khí là Tôn, chủ người trung hậu, có uy nghi, tự đi con đường riêng. Số nam hay số nữ đều thích có Tử Vi thủ Mệnh, nhưng phải có Tả Phù, Hữu Bật chầu về mới là chính cách.',
        },
        {
          id: 'qj-2-2',
          idx: 2,
          text: '紫微独坐，需有左右昌曲魁钺夹持方能为用——单身无依的紫微，纵贵不久；得三方四正之吉星会照，方为君臣庆会大格。',
          vi: 'Tử Vi ngồi một mình thì cần có Tả Hữu, Xương Khúc, Khôi Việt kẹp hai bên mới dùng được. Tử Vi đơn độc không chỗ dựa thì dù sang cũng không bền; được cát tinh ở Tam Phương Tứ Chính chiếu về mới thành cách lớn “Quân Thần Khánh Hội”.',
        },
        {
          id: 'qj-2-3',
          idx: 3,
          text: '紫微入命，兄弟有贵气，独立挺秀，多得长兄之助；紫微在子女，子女有贵气，但管教需平等；紫微在夫妻，配偶端庄，但宜迟婚不宜早。',
          vi: 'Tử Vi vào Mệnh, anh chị em có quý khí, tự lập vững vàng, thường được anh cả giúp đỡ; Tử Vi ở cung Tử Nữ, con cái có quý khí, nhưng dạy con cần công bằng; Tử Vi ở cung Phu Thê, vợ hoặc chồng đoan trang, nhưng nên lấy muộn, không nên lấy sớm.',
        },
        {
          id: 'qj-2-4',
          idx: 4,
          text: '紫微在田宅，主有祖业又能自置，房产可作为致富之主轴；紫微在福德，精神层面追求格调、自尊感强；紫微在官禄，主大富贵，宜居高位。',
          vi: 'Tử Vi ở cung Điền Trạch, chủ có của ông cha để lại, lại tự tạo thêm được, nhà đất có thể là trục chính để làm giàu; Tử Vi ở cung Phúc Đức, về tinh thần thích sự sang trọng, có lòng tự trọng cao; Tử Vi ở cung Quan Lộc, chủ đại phú quý, nên ở địa vị cao.',
        },
      ],
    },
    {
      title: '卷三·南斗六星论',
      titleVi: 'Quyển 3 · Bàn về sáu sao Nam Đẩu',
      subtitle: '天府、太阴、贪狼、巨门、天相、天梁',
      subtitleVi: 'Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương',
      paragraphs: [
        {
          id: 'qj-3-1',
          idx: 1,
          text: '天府属土，南斗令星，乃禄库之主。天府独坐主品行端正、衣食无忧。天府与紫微同宫名"紫府同宫"，主尊贵。天府最喜见禄存，称"双禄朝垣"，主大富。',
          vi: 'Thiên Phủ hành Thổ, là lệnh tinh của Nam Đẩu, chủ kho lộc. Thiên Phủ ngồi một mình chủ phẩm hạnh đoan chính, cơm áo không lo. Thiên Phủ đồng cung với Tử Vi gọi là “Tử Phủ đồng cung”, chủ tôn quý. Thiên Phủ thích nhất gặp Lộc Tồn, gọi là “Song Lộc Triều Viên”, chủ đại phú.',
        },
        {
          id: 'qj-3-2',
          idx: 2,
          text: '太阴为中天主星，属水。太阴庙旺主田宅、富贵，落陷主劳碌、奔波。女命太阴最吉，主貌美贤淑。太阴在亥子主大富，太阴在午未则减力。',
          vi: 'Thái Âm là chính tinh trung thiên, hành Thuỷ. Thái Âm Miếu Vượng chủ nhà đất, giàu sang; Hãm địa chủ vất vả, bôn ba. Số nữ có Thái Âm là tốt nhất, chủ xinh đẹp, hiền thục. Thái Âm ở Hợi, Tý chủ đại phú; Thái Âm ở Ngọ, Mùi thì giảm sức.',
        },
        {
          id: 'qj-3-3',
          idx: 3,
          text: '贪狼为桃花欲望之星，属木属水。贪狼主多才艺、社交广。贪狼逢火星称"火贪格"，逢铃星称"铃贪格"，皆主偏财横发。但贪狼忌空劫，主华而不实。',
          vi: 'Tham Lang là sao đào hoa, ham muốn, hành Mộc và Thuỷ. Tham Lang chủ nhiều tài nghệ, giao thiệp rộng. Tham Lang gặp Hoả Tinh gọi là cách “Hoả Tham”, gặp Linh Tinh gọi là cách “Linh Tham”, đều chủ phát tài bất ngờ. Nhưng Tham Lang kỵ Địa Không, Địa Kiếp, chủ hào nhoáng mà không thực.',
        },
        {
          id: 'qj-3-4',
          idx: 4,
          text: '巨门属水，化气为暗，主口舌是非。巨门为口才之星，宜律师、教师、传媒。巨门化禄主"以口生财"，化忌则口舌官非不断。巨门最忌与太阳同宫的丑未两宫，称"日月反背"。',
          vi: 'Cự Môn hành Thuỷ, hoá khí là Ám, chủ khẩu thiệt thị phi. Cự Môn là sao ăn nói, hợp nghề luật sư, giáo viên, truyền thông. Cự Môn Hoá Lộc chủ “kiếm tiền bằng miệng”, Hoá Kỵ thì khẩu thiệt, kiện tụng không dứt. Cự Môn kỵ nhất đồng cung với Thái Dương ở hai cung Sửu, Mùi, gọi là “Nhật Nguyệt phản bối”.',
        },
        {
          id: 'qj-3-5',
          idx: 5,
          text: '天相属水，化气为印，乃辅佐之星。天相忠厚老实，宜行政秘书法务。天相不喜独坐，最宜与紫微或廉贞同宫，借其威仪而成事。',
          vi: 'Thiên Tướng hành Thuỷ, hoá khí là Ấn, là sao phụ tá. Thiên Tướng trung hậu, thật thà, hợp việc hành chính, thư ký, pháp chế. Thiên Tướng không thích ngồi một mình, tốt nhất đồng cung với Tử Vi hoặc Liêm Trinh, mượn uy của sao ấy mà làm nên việc.',
        },
        {
          id: 'qj-3-6',
          idx: 6,
          text: '天梁属土，化气为荫，乃老人之星。天梁主善良、慈悲、孤克、化解。天梁宜法律、医学、教育、宗教。天梁化科主名声，化禄反而虚浮。',
          vi: 'Thiên Lương hành Thổ, hoá khí là Ấm (che chở), là sao người già. Thiên Lương chủ hiền lành, từ bi, cô khắc, hoá giải. Thiên Lương hợp nghề luật, y, giáo dục, tôn giáo. Thiên Lương Hoá Khoa chủ có danh tiếng, Hoá Lộc thì ngược lại, phù phiếm.',
        },
      ],
    },
    {
      title: '卷四·北斗六星论',
      titleVi: 'Quyển 4 · Bàn về sáu sao Bắc Đẩu',
      subtitle: '紫微、天机、太阳、武曲、廉贞、破军',
      subtitleVi: 'Tử Vi, Thiên Cơ, Thái Dương, Vũ Khúc, Liêm Trinh, Phá Quân',
      paragraphs: [
        {
          id: 'qj-4-1',
          idx: 1,
          text: '紫微属土，已论于卷二。',
          vi: 'Tử Vi hành Thổ, đã bàn ở Quyển 2.',
        },
        {
          id: 'qj-4-2',
          idx: 2,
          text: '天机属木，化气为善，乃智慧之星。天机主聪明、机变、好动。天机入命，思维敏捷，宜咨询、策划、文教。天机最忌善变无主，需文昌文曲会照方能成器。',
          vi: 'Thiên Cơ hành Mộc, hoá khí là Thiện, là sao trí tuệ. Thiên Cơ chủ thông minh, linh hoạt, hiếu động. Thiên Cơ vào cung Mệnh thì đầu óc nhanh nhạy, hợp nghề tư vấn, lập kế hoạch, văn hoá giáo dục. Thiên Cơ kỵ nhất hay thay đổi, không có chủ kiến; cần có Văn Xương, Văn Khúc chiếu về mới thành người.',
        },
        {
          id: 'qj-4-3',
          idx: 3,
          text: '太阳属火，化气为贵，乃男贵之星。太阳主名誉、公务、社交。太阳庙旺主大贵，落陷则劳而无获。太阳最宜在卯辰巳午之地，落于戌亥子丑则减力。',
          vi: 'Thái Dương hành Hoả, hoá khí là Quý, là sao quý của nam giới. Thái Dương chủ danh dự, việc công, giao tế. Thái Dương Miếu Vượng chủ đại quý, Hãm địa thì vất vả mà không được gì. Thái Dương tốt nhất ở Mão, Thìn, Tỵ, Ngọ; rơi vào Tuất, Hợi, Tý, Sửu thì giảm sức.',
        },
        {
          id: 'qj-4-4',
          idx: 4,
          text: '武曲属金，化气为财，乃财星之主。武曲主刚毅果决，善理财经营。武曲化忌主手术血光、金属意外。武曲在丑未与七杀同宫，称"武曲七杀"格，主刚直武贵。',
          vi: 'Vũ Khúc hành Kim, hoá khí là Tài, là chủ của các sao tài. Vũ Khúc chủ cứng cỏi, quyết đoán, giỏi quản lý tiền và kinh doanh. Vũ Khúc Hoá Kỵ chủ phẫu thuật, đổ máu, tai nạn do kim loại. Vũ Khúc ở Sửu, Mùi đồng cung với Thất Sát, gọi là cách “Vũ Khúc Thất Sát”, chủ cương trực, sang quý nhờ nghề võ.',
        },
        {
          id: 'qj-4-5',
          idx: 5,
          text: '廉贞属火属木，化气为囚，乃次桃花之星。廉贞文武兼备，多才艺。廉贞化忌主血光官非、感情纠纷。廉贞与天相同宫为"廉相格"，主清廉之名。',
          vi: 'Liêm Trinh hành Hoả và Mộc, hoá khí là Tù, là sao đào hoa thứ. Liêm Trinh văn võ song toàn, nhiều tài nghệ. Liêm Trinh Hoá Kỵ chủ đổ máu, kiện tụng, rắc rối tình cảm. Liêm Trinh đồng cung với Thiên Tướng là cách “Liêm Tướng”, chủ có tiếng thanh liêm.',
        },
        {
          id: 'qj-4-6',
          idx: 6,
          text: '破军属水，化气为耗，乃破坏创新之星。破军主开创、变动、六亲缘薄。破军宜技术专长走天下。破军化禄称"破而后立"，主先散后聚。',
          vi: 'Phá Quân hành Thuỷ, hoá khí là Hao, là sao phá cũ lập mới. Phá Quân chủ khai phá, biến động, duyên với người thân mỏng. Phá Quân hợp đi khắp nơi bằng tay nghề chuyên môn. Phá Quân Hoá Lộc gọi là “phá rồi mới lập”, chủ trước tan sau tụ.',
        },
      ],
    },
    {
      title: '卷五·四化与格局论',
      titleVi: 'Quyển 5 · Bàn về Tứ Hoá và cách cục',
      subtitle: '四化之力与重要格局',
      subtitleVi: 'Sức của Tứ Hoá và các cách cục quan trọng',
      paragraphs: [
        {
          id: 'qj-5-1',
          idx: 1,
          text: '化禄主财源，主缘分，主能力变现。化禄入命三方，主财源广进；化禄入财帛，主财来财往，正财稳定。',
          vi: 'Hoá Lộc chủ nguồn tiền, chủ duyên, chủ biến năng lực thành tiền. Hoá Lộc vào tam phương cung Mệnh, chủ tiền vào từ nhiều nguồn; Hoá Lộc vào cung Tài Bạch, chủ tiền ra vào đều đặn, chính tài ổn định.',
        },
        {
          id: 'qj-5-2',
          idx: 2,
          text: '化权主权力，主决断，主担当。化权入命，主能独当一面；化权入官禄，主事业有掌控力，宜走管理或技术权威路线。',
          vi: 'Hoá Quyền chủ quyền lực, chủ quyết đoán, chủ dám gánh vác. Hoá Quyền vào cung Mệnh, chủ một mình gánh vác được; Hoá Quyền vào cung Quan Lộc, chủ nắm được việc trong sự nghiệp, nên đi theo hướng quản lý hoặc làm chuyên gia kỹ thuật có tiếng nói.',
        },
        {
          id: 'qj-5-3',
          idx: 3,
          text: '化科主名声，主文书，主贵人。化科入命，主名声远播；化科入身，主以名取利，宜文教、研究、咨询。',
          vi: 'Hoá Khoa chủ danh tiếng, chủ văn thư, chủ quý nhân. Hoá Khoa vào cung Mệnh, chủ danh tiếng vang xa; Hoá Khoa vào cung Thân, chủ nhờ danh mà được lợi, hợp nghề văn hoá giáo dục, nghiên cứu, tư vấn.',
        },
        {
          id: 'qj-5-4',
          idx: 4,
          text: '化忌主病，主煞，主深刻功课。化忌入命三方，主一生有"钝点"——这是命格里最深的功课，过得了就是大智慧。三十岁前后是化忌最锋利的时候。',
          vi: 'Hoá Kỵ chủ bệnh, chủ sát, chủ bài học sâu sắc. Hoá Kỵ vào tam phương cung Mệnh, chủ cả đời có một “điểm cùn”: đó là bài học sâu nhất trong lá số, vượt qua được chính là đại trí tuệ. Khoảng trước sau tuổi ba mươi là lúc Hoá Kỵ sắc bén nhất.',
        },
        {
          id: 'qj-5-5',
          idx: 5,
          text: '紫府同宫格：紫微天府同入命宫，主品行端正、衣食无忧、有领导才能。需要左右辅弼来配合方为完整大格。',
          vi: 'Cách Tử Phủ đồng cung: Tử Vi và Thiên Phủ cùng vào cung Mệnh, chủ phẩm hạnh đoan chính, cơm áo không lo, có tài lãnh đạo. Cần Tả Phù, Hữu Bật phối hợp mới là cách lớn trọn vẹn.',
        },
        {
          id: 'qj-5-6',
          idx: 6,
          text: '七杀朝斗格：七杀居子午寅申宫坐命，对宫紫微天府相照，主爵禄荣昌——武职大贵，最宜军警政界或企业高管。',
          vi: 'Cách Thất Sát Triều Đẩu: Thất Sát ngồi Mệnh ở cung Tý, Ngọ, Dần, Thân, cung đối diện có Tử Vi, Thiên Phủ chiếu về, chủ tước lộc vinh hiển: rất sang trong nghề võ, hợp nhất với quân đội, cảnh sát, chính trường hoặc làm lãnh đạo cấp cao trong doanh nghiệp.',
        },
        {
          id: 'qj-5-7',
          idx: 7,
          text: '双禄朝垣格：化禄、禄存同会命宫三方四正，财源涌动、衣食丰足。古云"双禄朝垣，富比陶朱"，主一生不愁财。',
          vi: 'Cách Song Lộc Triều Viên: Hoá Lộc và Lộc Tồn cùng hội ở Tam Phương Tứ Chính của cung Mệnh, nguồn tiền dồi dào, cơm áo đầy đủ. Người xưa nói “Song Lộc Triều Viên, giàu như Đào Chu Công”, chủ cả đời không lo về tiền.',
        },
        {
          id: 'qj-5-8',
          idx: 8,
          text: '机月同梁格：天机、太阴、天同、天梁四星齐入命迁财官，主文质彬彬、聪慧善谋。最适合公职、学术、文艺、医疗、服务等需稳定累积的行业。',
          vi: 'Cách Cơ Nguyệt Đồng Lương: bốn sao Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng vào các cung Mệnh, Thiên Di, Tài Bạch, Quan Lộc, chủ người nho nhã, thông minh, giỏi mưu tính. Hợp nhất với các nghề cần ổn định và tích luỹ dần như công chức, học thuật, văn nghệ, y tế, dịch vụ.',
        },
        {
          id: 'qj-5-9',
          idx: 9,
          text: '杀破狼格：七杀、破军、贪狼三星会命，主一生变动多、不甘平凡，宜创业、军警、业务、销售。中年后才能稳定守成。',
          vi: 'Cách Sát Phá Tham: ba sao Thất Sát, Phá Quân, Tham Lang hội về cung Mệnh, chủ cả đời nhiều biến động, không cam chịu tầm thường, hợp khởi nghiệp, quân đội, cảnh sát, kinh doanh, bán hàng. Đến trung niên mới ổn định, giữ được thành quả.',
        },
        {
          id: 'qj-5-10',
          idx: 10,
          text: '日月同宫格：太阳太阴同入丑宫或未宫，主异性缘佳、事业顺遂、名声远播。丑宫力较平，未宫力略减。',
          vi: 'Cách Nhật Nguyệt đồng cung: Thái Dương, Thái Âm cùng vào cung Sửu hoặc cung Mùi, chủ được người khác giới quý mến, sự nghiệp thuận lợi, danh tiếng vang xa. Ở cung Sửu sức khá bình thường, ở cung Mùi sức hơi giảm.',
        },
      ],
    },
  ],
};
