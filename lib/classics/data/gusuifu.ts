/**
 * 《骨髓赋》— 紫微斗数核心口诀
 *
 * 公版（明代刊本）。是紫微斗数最权威、最浓缩的口诀，长约 1500 字。
 * 倪师在《天纪》中多次援引此赋。
 */

import type { Book } from '../types';

export const guSuiFu: Book = {
  title: '骨髓赋',
  titleVi: 'Cốt Tuỷ Phú',
  slug: 'gusuifu',
  dynasty: '明代',
  dynastyVi: 'Đời Minh',
  author: '紫微斗数古籍传承（无确切作者）',
  authorVi: 'Không rõ tác giả (lưu truyền trong các sách cổ Tử Vi)',
  intro: '紫微斗数最浓缩的核心口诀，全文约 1500 字。倪海厦《天纪》中多次援引此赋，是紫微学者必读经典。',
  introVi: 'Bài phú cô đọng nhất về những điều cốt lõi của Tử Vi Đẩu Số, toàn văn khoảng 1.500 chữ. Thầy Nghê Hải Hạ nhiều lần dẫn bài phú này trong bộ “Thiên Kỷ”; người học Tử Vi nên đọc.',
  wordCount: 1500,
  chapters: [
    {
      title: '总论篇',
      titleVi: 'Phần tổng luận',
      subtitle: '紫微斗数的基本立论',
      subtitleVi: 'Những luận điểm nền tảng của Tử Vi Đẩu Số',
      paragraphs: [
        {
          id: 'gsf-1-1',
          idx: 1,
          text: '太极星曜，乃群星之主。紫微帝座，为众星之尊。天府令星，南北斗化禄、化权、令星；左辅右弼，主祭祀之星。',
          vi: 'Sao Thái Cực là chủ của các sao. Tử Vi ở ngôi đế, là sao tôn quý nhất trong các sao. Thiên Phủ là lệnh tinh; các sao Nam Đẩu, Bắc Đẩu có Hoá Lộc, Hoá Quyền và lệnh tinh; Tả Phù, Hữu Bật là sao chủ việc tế tự.',
        },
        {
          id: 'gsf-1-2',
          idx: 2,
          text: '紫微为君，以左辅右弼为相。天府为臣，以禄存为府库。天机为善，天梁为荫，遇之则吉；廉贞为囚，破军为耗，逢之则凶。',
          vi: 'Tử Vi là vua, lấy Tả Phù, Hữu Bật làm tể tướng. Thiên Phủ là bề tôi, lấy Lộc Tồn làm kho. Thiên Cơ là sao thiện, Thiên Lương là sao che chở, gặp thì tốt; Liêm Trinh là sao tù, Phá Quân là sao hao, gặp thì xấu.',
        },
        {
          id: 'gsf-1-3',
          idx: 3,
          text: '看命之要，先看命宫。命宫主星定其格局，三方四正定其用武。次看身宫，身宫定其晚景与依归。再看大限流年，定其一生进退之节。',
          vi: 'Muốn xem lá số, trước hết xem cung Mệnh. Chính tinh ở cung Mệnh định cách cục, Tam Phương Tứ Chính cho biết chỗ người ấy phát huy được tài năng. Sau đó xem cung Thân: cung Thân cho biết cảnh về già và chỗ nương tựa. Cuối cùng xem Đại Hạn, Lưu Niên để biết lúc tiến lúc lui trong cả đời.',
        },
      ],
    },
    {
      title: '紫微星论',
      titleVi: 'Bàn về sao Tử Vi',
      subtitle: '帝座之尊，得辅则贵',
      subtitleVi: 'Ngôi đế tôn quý, có người phò tá thì sang',
      paragraphs: [
        {
          id: 'gsf-2-1',
          idx: 1,
          text: '紫微为帝座之星，得辅弼则贵，得昌曲则秀，得魁钺则贵人扶持。紫微独坐无辅，纵贵不久；得三方四正之吉星会照，方为正宗大格。',
          vi: 'Tử Vi là sao ngôi đế: gặp Tả Phù, Hữu Bật thì quý; gặp Văn Xương, Văn Khúc thì thanh tú; gặp Thiên Khôi, Thiên Việt thì có quý nhân nâng đỡ. Tử Vi ngồi một mình không có người phò tá thì dù sang cũng không bền; được cát tinh ở Tam Phương Tứ Chính chiếu về mới là cách lớn chính tông.',
        },
        {
          id: 'gsf-2-2',
          idx: 2,
          text: '紫微在子午为「面南背北」之贵，主大富大贵；紫微在丑未与破军同宫，主刚毅果决；紫微在寅申与天府同宫，称「紫府同宫」格，主品端衣食丰足。',
          vi: 'Tử Vi ở Tý, Ngọ là thế “hướng mặt về Nam, tựa lưng về Bắc” (thế ngồi của bậc vua), chủ đại phú đại quý; Tử Vi ở Sửu, Mùi đồng cung với Phá Quân, chủ cứng cỏi, quyết đoán; Tử Vi ở Dần, Thân đồng cung với Thiên Phủ, gọi là cách “Tử Phủ đồng cung”, chủ phẩm hạnh đoan chính, cơm áo đầy đủ.',
        },
        {
          id: 'gsf-2-3',
          idx: 3,
          text: '紫微居官禄，无煞冲破，必为高官；紫微居田宅，主有祖业，又能自置；紫微居夫妻，主配偶端庄，气质不凡，但宜迟婚不宜早。',
          vi: 'Tử Vi ở cung Quan Lộc, không bị sát tinh xung phá, ắt làm quan to; Tử Vi ở cung Điền Trạch, chủ có của ông cha để lại, lại tự tạo dựng thêm được; Tử Vi ở cung Phu Thê, chủ vợ hoặc chồng đoan trang, khí chất hơn người, nhưng nên lấy muộn, không nên lấy sớm.',
        },
        {
          id: 'gsf-2-4',
          idx: 4,
          text: '紫微忌空劫，主有位无禄。紫微忌孤君无辅，主孤峰独峙，难成大事。紫微化权主独断，紫微化科主名声，紫微化忌主受制于人。',
          vi: 'Tử Vi kỵ gặp Địa Không, Địa Kiếp: chủ có địa vị mà không có lộc. Tử Vi kỵ thế “vua cô độc không người phò tá”: như đỉnh núi đứng trơ trọi, khó làm nên việc lớn. Tử Vi Hoá Quyền chủ độc đoán, Tử Vi Hoá Khoa chủ có danh tiếng, Tử Vi Hoá Kỵ chủ bị người khác kìm hãm.',
        },
      ],
    },
    {
      title: '七杀星论',
      titleVi: 'Bàn về sao Thất Sát',
      subtitle: '将星孤独，宜武职',
      subtitleVi: 'Sao tướng cô độc, hợp nghề võ',
      paragraphs: [
        {
          id: 'gsf-3-1',
          idx: 1,
          text: '七杀为将星，性刚毅果决。七杀守命，不喜与诸吉同宫，独行其道方为本格。七杀逢空劫，主孤独漂泊，事业难成。',
          vi: 'Thất Sát là sao tướng, tính cứng cỏi, quyết đoán. Thất Sát thủ Mệnh không thích đồng cung với các cát tinh, tự đi con đường riêng mới đúng bản cách. Thất Sát gặp Địa Không, Địa Kiếp, chủ cô độc, phiêu bạt, sự nghiệp khó thành.',
        },
        {
          id: 'gsf-3-2',
          idx: 2,
          text: '七杀朝斗格：七杀居子午、寅申，对宫紫微天府相照，主爵禄荣昌。最宜军警武职、开疆拓土。一生贵气难挡，但需经磨炼方成大器。',
          vi: 'Cách Thất Sát Triều Đẩu: Thất Sát ở Tý, Ngọ, Dần, Thân, cung đối diện có Tử Vi, Thiên Phủ chiếu về, chủ tước lộc vinh hiển. Hợp nhất với nghề quân đội, cảnh sát, võ nghiệp, mở mang bờ cõi. Cả đời có quý khí khó cản, nhưng phải qua rèn luyện mới thành người tài lớn.',
        },
        {
          id: 'gsf-3-3',
          idx: 3,
          text: '七杀逢羊陀，主刑伤血光；七杀逢火铃，主威武刚烈；七杀逢化禄，主一身武贵；七杀逢化忌，反主消沉，事业多败。',
          vi: 'Thất Sát gặp Kình Dương, Đà La, chủ bị thương tích, đổ máu; Thất Sát gặp Hoả Tinh, Linh Tinh, chủ uy vũ, cương liệt; Thất Sát gặp Hoá Lộc, chủ sang quý nhờ nghề võ; Thất Sát gặp Hoá Kỵ thì ngược lại, chủ sa sút, sự nghiệp nhiều thất bại.',
        },
      ],
    },
    {
      title: '杀破狼格',
      titleVi: 'Cách Sát Phá Tham',
      subtitle: '开创闯荡，变动之命',
      subtitleVi: 'Số khai phá, xông pha, nhiều biến động',
      paragraphs: [
        {
          id: 'gsf-4-1',
          idx: 1,
          text: '七杀、破军、贪狼三星会命迁财官，称「杀破狼格」。主一生变动多、不甘平凡，宜创业、军警、业务。年轻易冲动失利，中年后方能稳定守成。',
          vi: 'Ba sao Thất Sát, Phá Quân, Tham Lang hội ở các cung Mệnh, Thiên Di, Tài Bạch, Quan Lộc, gọi là cách “Sát Phá Tham”. Chủ cả đời nhiều biến động, không cam chịu tầm thường, hợp khởi nghiệp, quân đội, cảnh sát, kinh doanh. Lúc trẻ dễ bốc đồng mà thất bại, đến trung niên mới ổn định, giữ được thành quả.',
        },
        {
          id: 'gsf-4-2',
          idx: 2,
          text: '杀破狼三方有化禄或化权，主动得有力，可成大事；若三方煞星过重（羊陀火铃齐照），主动而无成，宜静守。',
          vi: 'Tam phương của Sát Phá Tham có Hoá Lộc hoặc Hoá Quyền, chủ hành động có sức, làm được việc lớn; nếu sát tinh ở tam phương quá nặng (Kình Dương, Đà La, Hoả Tinh, Linh Tinh cùng chiếu), chủ động mà không thành, nên tĩnh lặng giữ mình.',
        },
      ],
    },
    {
      title: '机月同梁',
      titleVi: 'Cách Cơ Nguyệt Đồng Lương',
      subtitle: '稳定累积，宜公职',
      subtitleVi: 'Ổn định, tích luỹ dần, hợp làm việc nhà nước',
      paragraphs: [
        {
          id: 'gsf-5-1',
          idx: 1,
          text: '天机、太阴、天同、天梁四星齐入命迁财官，称「机月同梁格」。主文质彬彬、聪慧善谋。最适合公职、学术、文艺、医疗、服务等需稳定累积的行业，不宜大冒险大投机。',
          vi: 'Bốn sao Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng vào các cung Mệnh, Thiên Di, Tài Bạch, Quan Lộc, gọi là cách “Cơ Nguyệt Đồng Lương”. Chủ người nho nhã, thông minh, giỏi mưu tính. Hợp nhất với các nghề cần ổn định và tích luỹ dần như công chức, học thuật, văn nghệ, y tế, dịch vụ; không nên mạo hiểm lớn hay đầu cơ lớn.',
        },
        {
          id: 'gsf-5-2',
          idx: 2,
          text: '机月同梁作吏人——古云此格者宜担任公职、行政文书工作，安稳一生。再会昌曲化科，主名声远播。最忌煞星过多，则反主多变难安。',
          vi: '“Cơ Nguyệt Đồng Lương tác lại nhân” (Cơ Nguyệt Đồng Lương làm quan lại): người xưa nói người có cách này nên làm công chức, làm việc hành chính, giấy tờ, cả đời yên ổn. Nếu gặp thêm Văn Xương, Văn Khúc, Hoá Khoa thì danh tiếng vang xa. Kỵ nhất là sát tinh quá nhiều, khi đó ngược lại chủ hay thay đổi, khó yên.',
        },
      ],
    },
    {
      title: '四化星论',
      titleVi: 'Bàn về Tứ Hoá',
      subtitle: '化禄化权化科化忌之吉凶',
      subtitleVi: 'Tốt xấu của Hoá Lộc, Hoá Quyền, Hoá Khoa, Hoá Kỵ',
      paragraphs: [
        {
          id: 'gsf-6-1',
          idx: 1,
          text: '化禄主财、主缘、主能力变现；化权主权、主决断、主独当一面；化科主名、主贵人、主文书；化忌主病、主煞、主深刻功课。',
          vi: 'Hoá Lộc chủ tiền tài, chủ duyên, chủ biến năng lực thành tiền; Hoá Quyền chủ quyền lực, chủ quyết đoán, chủ một mình gánh vác; Hoá Khoa chủ danh tiếng, chủ quý nhân, chủ giấy tờ văn thư; Hoá Kỵ chủ bệnh, chủ sát, chủ bài học sâu sắc phải trải qua.',
        },
        {
          id: 'gsf-6-2',
          idx: 2,
          text: '化禄入命，财源广进；化权入命，能担大任；化科入命，名声远播；化忌入命，须经磨炼方能成器。',
          vi: 'Hoá Lộc vào cung Mệnh, tiền vào từ nhiều nguồn; Hoá Quyền vào cung Mệnh, gánh được việc lớn; Hoá Khoa vào cung Mệnh, danh tiếng vang xa; Hoá Kỵ vào cung Mệnh, phải qua rèn luyện mới thành người.',
        },
        {
          id: 'gsf-6-3',
          idx: 3,
          text: '化忌入财，主财来财去；化忌入官，主事业受挫；化忌入夫妻，主婚姻多波折；化忌入子女，主子女缘薄或亲子摩擦。',
          vi: 'Hoá Kỵ vào cung Tài Bạch, chủ tiền đến rồi đi; Hoá Kỵ vào cung Quan Lộc, chủ sự nghiệp gặp trắc trở; Hoá Kỵ vào cung Phu Thê, chủ hôn nhân nhiều sóng gió; Hoá Kỵ vào cung Tử Nữ, chủ duyên với con cái mỏng hoặc cha mẹ con cái hay va chạm.',
        },
        {
          id: 'gsf-6-4',
          idx: 4,
          text: '禄存与化禄同会命三方，称「双禄朝垣」，主富比陶朱；化科与化权同会，称「科权双会」，主名权双美。',
          vi: 'Lộc Tồn và Hoá Lộc cùng hội ở tam phương cung Mệnh, gọi là “Song Lộc Triều Viên”, chủ giàu như Đào Chu Công; Hoá Khoa và Hoá Quyền cùng hội, gọi là “Khoa Quyền song hội”, chủ có cả danh lẫn quyền.',
        },
      ],
    },
    {
      title: '辅弼魁钺论',
      titleVi: 'Bàn về Tả Hữu, Xương Khúc, Khôi Việt',
      subtitle: '六吉星之贵',
      subtitleVi: 'Sự quý của sáu cát tinh',
      paragraphs: [
        {
          id: 'gsf-7-1',
          idx: 1,
          text: '左辅右弼为「相星」，主助力贵人；文昌文曲为「文星」，主聪明俊秀；天魁天钺为「贵人星」，主关键时刻有人扶持。',
          vi: 'Tả Phù, Hữu Bật là “sao phụ tá”, chủ có người giúp sức, có quý nhân; Văn Xương, Văn Khúc là “sao văn”, chủ thông minh, tuấn tú; Thiên Khôi, Thiên Việt là “sao quý nhân”, chủ lúc then chốt có người nâng đỡ.',
        },
        {
          id: 'gsf-7-2',
          idx: 2,
          text: '六吉星齐会命宫三方四正，主一生贵人不绝、人缘极佳。即使命格平常，亦能借六吉之力达成不凡之业。',
          vi: 'Sáu cát tinh cùng hội ở Tam Phương Tứ Chính của cung Mệnh, chủ cả đời không thiếu quý nhân, rất được lòng người. Dù cách cục bình thường cũng có thể nhờ sức của sáu cát tinh mà làm nên việc phi thường.',
        },
        {
          id: 'gsf-7-3',
          idx: 3,
          text: '辅弼夹命：左辅右弼夹于命宫前后两宫，主一生贵人扶持，遇困有助。最宜与紫微同宫，称「君臣庆会」格。',
          vi: 'Tả Hữu giáp Mệnh: Tả Phù, Hữu Bật nằm ở hai cung trước và sau cung Mệnh, chủ cả đời có quý nhân nâng đỡ, gặp khó có người giúp. Tốt nhất là đồng cung với Tử Vi, gọi là cách “Quân Thần Khánh Hội” (vua tôi gặp gỡ vui mừng).',
        },
      ],
    },
    {
      title: '六煞星论',
      titleVi: 'Bàn về sáu sát tinh',
      subtitle: '羊陀火铃空劫之凶',
      subtitleVi: 'Cái xấu của Kình Đà, Hoả Linh, Không Kiếp',
      paragraphs: [
        {
          id: 'gsf-8-1',
          idx: 1,
          text: '擎羊陀罗为「煞星」，主血光、是非、阻碍；火星铃星为「燥星」，主冲动、急躁、伤灾；地空地劫为「空亡」，主财耗、虚名、不实。',
          vi: 'Kình Dương, Đà La là “sát tinh”, chủ đổ máu, thị phi, trở ngại; Hoả Tinh, Linh Tinh là “sao nóng”, chủ bốc đồng, nóng vội, tai nạn thương tích; Địa Không, Địa Kiếp là “không vong”, chủ hao tiền, danh hão, không thực.',
        },
        {
          id: 'gsf-8-2',
          idx: 2,
          text: '煞星不全是凶——煞星犹如磨刀石，能炼出常人没有的破局力。年轻时易冲动伤己，中年后方能化煞为权。',
          vi: 'Sát tinh không hẳn đều xấu: sát tinh như hòn đá mài dao, có thể luyện ra sức phá thế bế tắc mà người thường không có. Lúc trẻ dễ bốc đồng tự làm hại mình, đến trung niên mới biến được sát khí thành quyền lực.',
        },
        {
          id: 'gsf-8-3',
          idx: 3,
          text: '羊陀夹忌：擎羊陀罗夹于化忌星所在宫，主大凶。其年其大限须特别警觉血光、官非、重大变故。',
          vi: 'Kình Đà giáp Kỵ: Kình Dương, Đà La kẹp hai bên cung có sao Hoá Kỵ, chủ rất xấu. Năm đó, Đại Hạn đó phải đặc biệt đề phòng đổ máu, kiện tụng, biến cố lớn.',
        },
        {
          id: 'gsf-8-4',
          idx: 4,
          text: '空劫夹命：地空地劫夹于命宫前后两宫，主一生宜务虚不务实，宜从事文艺、宗教、玄学等"非实"行业，不宜经商投资。',
          vi: 'Không Kiếp giáp Mệnh: Địa Không, Địa Kiếp nằm ở hai cung trước và sau cung Mệnh, chủ cả đời hợp với việc thuộc tinh thần hơn việc thực tế, nên làm các nghề “không thực” như văn nghệ, tôn giáo, huyền học; không nên buôn bán, đầu tư.',
        },
      ],
    },
    {
      title: '十二宫论',
      titleVi: 'Bàn về mười hai cung',
      subtitle: '各宫主象与吉凶',
      subtitleVi: 'Ý nghĩa và tốt xấu của từng cung',
      paragraphs: [
        {
          id: 'gsf-9-1',
          idx: 1,
          text: '命宫为本，三方为用：财帛主财源、官禄主事业、迁移主外缘。三方四正吉星会照，命格方能完整发用。',
          vi: 'Cung Mệnh là gốc, tam phương là chỗ dùng: cung Tài Bạch chủ nguồn tiền, cung Quan Lộc chủ sự nghiệp, cung Thiên Di chủ duyên bên ngoài. Có cát tinh ở Tam Phương Tứ Chính chiếu về thì cách cục mới phát huy trọn vẹn.',
        },
        {
          id: 'gsf-9-2',
          idx: 2,
          text: '夫妻宫看配偶气质，子女宫看子女缘分，疾厄宫看身体罩门，迁移宫看外出运势。各宫主星与四化决定该领域之吉凶进退。',
          vi: 'Cung Phu Thê xem khí chất của vợ chồng, cung Tử Nữ xem duyên với con cái, cung Tật Ách xem điểm yếu của cơ thể, cung Thiên Di xem vận khi ra ngoài. Chính tinh và Tứ Hoá ở mỗi cung quyết định tốt xấu, tiến lùi trong việc của cung ấy.',
        },
        {
          id: 'gsf-9-3',
          idx: 3,
          text: '田宅宫为命盘财库，正财能否守住看此宫；福德宫为精神享受，心安与否看此宫；父母宫为长辈关系，亦主文书契约。',
          vi: 'Cung Điền Trạch là kho tiền của lá số, giữ được chính tài hay không thì xem cung này; cung Phúc Đức là sự hưởng thụ tinh thần, lòng có yên hay không thì xem cung này; cung Phụ Mẫu là quan hệ với bề trên, cũng chủ giấy tờ, hợp đồng.',
        },
        {
          id: 'gsf-9-4',
          idx: 4,
          text: '空宫借对宫论事——某宫无主星时，借其对宫主星论该宫之事。如命宫空宫，借迁移宫主星定命格。',
          vi: 'Cung trống thì mượn cung đối diện để luận: khi một cung không có chính tinh, mượn chính tinh ở cung đối diện để luận việc của cung đó. Ví dụ cung Mệnh trống thì mượn chính tinh của cung Thiên Di để định cách cục.',
        },
      ],
    },
  ],
};
